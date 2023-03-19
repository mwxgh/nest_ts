import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionRepository } from '../repositories/permission.repository'
import { Entity } from '@shared/interfaces/response.interface'
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@authModule/dto/permission.dto'
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
   * Save permission and return permission entity with relations
   *
   * @param data  CreatePermissionDto
   * @return Permission
   */
  async savePermission({
    data,
  }: {
    data: CreatePermissionDto
  }): Promise<PermissionEntity> {
    const slug = await this.generateSlug(data.name)

    return this.create(assign(data, { slug: slug }))
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
    await this.findOneOrFail(id)

    const slug = await this.generateSlug(data.name)

    return this.update(id, assign(data, { slug: slug }))
  }

  /**
   * Delete permission
   *
   * @param id  number
   *
   * @return void
   */
  async deletePermission({ id }: { id: number }): Promise<void> {
    await this.findOneOrFail(id)

    await this.rolePermissionService.destroy({ permissionId: id })

    await this.destroy(id)
  }
}
