import { ForbiddenException, Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'
import { UpdateRoleDto } from '@authModule/dto/role.dto'
import { includes, map } from 'lodash'
import { Entity } from '@shared/interfaces/response.interface'
import { UserRoleService } from './userRole.service'
import { Me } from '@userModule/dto/user.dto'
import { PermissionEntity } from '@authModule/entities/permission.entity'

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<RoleEntity>
  public entity: Entity = RoleEntity

  constructor(
    private connection: Connection,
    private userRoleService: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(RoleRepository)
  }

  /**
   * Update role and return role entity with relations
   *
   * @param id  number
   * @param data  UpdateRoleDto
   *
   * @return Role
   */
  async updateRole({
    id,
    data,
    relations,
  }: {
    id: number
    data: UpdateRoleDto
    relations: string[]
  }): Promise<RoleEntity> {
    await this.checkExisting({ where: { id } })

    if (data.name) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    const updateRole: PermissionEntity = await this.update(id, data)

    return await this.findOneOrFail(updateRole.id, { relations })
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
}
