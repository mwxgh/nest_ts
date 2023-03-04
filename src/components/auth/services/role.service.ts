import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'
import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { pick } from 'lodash'

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<any>
  public entity: any = RoleEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(RoleRepository)
  }

  /**
   * Save role and return role entity with relations
   *
   * @param params.data  CreateRoleDto
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
   * @param params.data  UpdateRoleDto
   * @return Role
   */
  async updateRole(params: {
    id: number
    data: UpdateRoleDto
  }): Promise<RoleEntity> {
    const { id, data } = params

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
}
