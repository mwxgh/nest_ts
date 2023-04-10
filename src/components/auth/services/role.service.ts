import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Me } from '@userModule/dto/user.dto'
import { includes, map } from 'lodash'
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
}
