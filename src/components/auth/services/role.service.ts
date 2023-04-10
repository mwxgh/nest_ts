import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { UserRoleEntity } from '@authModule/entities/userRole.entity'
import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Me } from '@userModule/dto/user.dto'
import { UserService } from '@userModule/services/user.service'
import { difference, includes, isNil, map } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'
import { UserRoleService } from './userRole.service'

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<RoleEntity>
  public entity: Entity = RoleEntity

  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private userRoleService: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(RoleRepository)
  }

  /**
   * Create role and return role entity
   *
   * @param data  CreateRoleDto
   *
   * @return Role
   */
  async createRole(data: CreateRoleDto): Promise<RoleEntity> {
    if (data.name) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    return this.create(data)
  }

  /**
   * Update role and return role entity
   *
   * @param id  number
   * @param data  UpdateRoleDto
   *
   * @return Role
   */
  async updateRole({
    id,
    data,
  }: {
    id: number
    data: UpdateRoleDto
  }): Promise<RoleEntity> {
    await this.checkExisting({ where: { id } })

    if (data.name) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    return this.update(id, data)
  }

  /**
   * Delete role
   *
   * @param id  number
   * @param currentUser  Me
   *
   * @return void
   */
  async deleteRole({
    id,
    currentUser,
  }: {
    id: number
    currentUser: Me
  }): Promise<void> {
    await this.checkExisting({ where: { id } })

    const currentRole = map(currentUser.roles, (r) => r.id)
    if (includes(currentRole, id) && currentRole.length === 1) {
      throw new ForbiddenException('Your only role cannot be deleted')
    }

    await this.userRoleService.destroy({ roleId: id })

    await this.destroy(id)
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
    await this.checkExisting({ where: { id: roleId } })

    await this.userService.checkExisting({ where: { id: userId } })

    await this.userRoleService.firstOrCreate(
      { where: { userId, roleId } },
      { userId, roleId },
    )
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
    await this.checkExisting({ where: { id: roleId } })

    await this.userService.checkExisting({ where: { id: userId } })

    await this.userRoleService.destroy({ userId, roleId })
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
    const userRoles: UserRoleEntity[] = await this.userRoleService.findWhere(
      { userId },
      ['roleId'],
    )

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

    const roles: RoleEntity[] = await this.findIdInOrFail(newAttachRoleIds)

    if (!isNil(roles) && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)

      for (const roleId of roleIds) {
        await this.attachRole({ userId, roleId })
      }
    }
  }
}
