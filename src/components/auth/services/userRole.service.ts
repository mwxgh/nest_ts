import { RoleEntity } from '@authModule/entities/role.entity'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { UserService } from '@userModule/services/user.service'
import { difference, isNil } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { UserRoleEntity } from '../entities/userRole.entity'
import { UserRoleRepository } from '../repositories/userRole.repository'
import { RoleService } from './role.service'

@Injectable()
export class UserRoleService extends BaseService {
  public repository: Repository<UserRoleEntity>
  public entity: Entity = UserRoleEntity

  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => RoleService))
    private role: RoleService,
    @Inject(forwardRef(() => UserService))
    private user: UserService,
  ) {
    super()
    this.repository = connection.getCustomRepository(UserRoleRepository)
  }

  /**
   * Attach user and role
   *
   * @param params.userId userId
   * @param params.roleId roleId
   */
  async attachRole({
    userId,
    roleId,
  }: {
    userId: number
    roleId: number
  }): Promise<void> {
    await this.role.checkExisting({ where: { id: roleId } })

    await this.user.checkExisting({ where: { id: userId } })

    await this.firstOrCreate({ where: { userId, roleId } }, { userId, roleId })
  }

  /**
   * Detach user and role
   *
   * @param params.userId userId
   * @param params.roleId roleId
   */
  async detachRole({
    userId,
    roleId,
  }: {
    userId: number
    roleId: number
  }): Promise<void> {
    await this.role.checkExisting({ where: { id: roleId } })

    await this.user.checkExisting({ where: { id: userId } })

    await this.destroy({ userId, roleId })
  }

  /**
   * Update relation role when update user ...
   * @param params.userId
   * @param params.roleIds
   */
  async updateRelationUserAndRole({
    userId,
    roleIds,
  }: {
    userId: number
    roleIds: number[]
  }): Promise<void> {
    const userRoles: UserRoleEntity[] = await this.findWhere({ userId }, [
      'roleId',
    ])

    if (userRoles.length === 0) {
      return
    }

    const currentRoleIds = userRoles.map((userRole) => userRole.roleId)

    // detach role
    const detachRoleIds: number[] = difference(currentRoleIds, roleIds)

    for (const detachRoleId of detachRoleIds) {
      await this.detachRole({ userId, roleId: detachRoleId })
    }

    // attach new role
    const newAttachRoleIds: number[] = difference(roleIds, currentRoleIds)

    const roles: RoleEntity[] = await this.role.findIdInOrFail(newAttachRoleIds)

    if (!isNil(roles) && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)

      for (const roleId of roleIds) {
        await this.attachRole({ userId, roleId })
      }
    }
  }
}
