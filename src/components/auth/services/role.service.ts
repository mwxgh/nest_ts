import { ForbiddenException, Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'
import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { includes, map, pick } from 'lodash'
import { Entity } from '@shared/interfaces/response.interface'
import { UserRoleService } from './userRole.service'
import { Me } from '@userModule/dto/user.dto'

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
   * Save role and return role entity with relations
   *
   * @param params.data  CreateRoleDto
   *
   * @return Role
   */
  async saveRole(params: { data: CreateRoleDto }): Promise<RoleEntity> {
    const { data } = params

    const saveRole: RoleEntity = await this.create({
      ...pick(data, ['name', 'level']),
      ...{
        slug: await this.generateSlug(data.name),
      },
    })

    return await this.findOneOrFail(saveRole.id, { relations: ['permissions'] })
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
  }: {
    id: number
    data: UpdateRoleDto
  }): Promise<RoleEntity> {
    const existingRole: RoleEntity = await this.findOneOrFail(id)

    const updateRole = await this.update(existingRole.id, {
      ...pick(data, ['name', 'level']),
      ...{
        slug: await this.generateSlug(data.name),
      },
    })

    return await this.findOneOrFail(updateRole.id, {
      relations: ['permissions'],
    })
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
    const currentRole = map(currentUser.roles, (r) => r.id)

    if (includes(currentRole, id) && currentRole.length === 1) {
      throw new ForbiddenException('Your only role cannot be deleted')
    }

    await this.findOneOrFail(id)

    await this.userRoleService.destroy({ roleId: id })

    await this.destroy(id)
  }
}
