import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionRepository } from '../repositories/permission.repository'
import { Entity } from '@shared/interfaces/response.interface'
import { UpdatePermissionDto } from '@authModule/dto/permission.dto'
import { assign } from 'lodash'
import { RolePermissionService } from './rolePermission.service'

@Injectable()
export class PermissionService extends BaseService {
  public repository: Repository<PermissionEntity>
  public entity: Entity = PermissionEntity

  constructor(
    private connection: Connection,
    private rolePermissionService: RolePermissionService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(PermissionRepository)
  }

  /**
   * Update permission and return permission entity with relations
   *
   * @param id  number
   * @param data  UpdatePermissionDto
   *
   * @return Permission
   */
  async updatePermission({
    id,
    data,
  }: {
    id: number
    data: UpdatePermissionDto
  }): Promise<PermissionEntity> {
    await this.checkExisting({ where: { id } })

    const slug = await this.generateSlug(data.name)

    return this.update(id, assign(data, { slug }))
  }

  /**
   * Delete permission
   *
   * @param id  number
   *
   * @return void
   */
  async deletePermission(id: number): Promise<void> {
    await this.checkExisting({ where: { id } })

    await this.rolePermissionService.destroy({ permissionId: id })

    await this.destroy(id)
  }
}
