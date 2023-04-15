import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@authModule/dto/permission.dto'
import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionRepository } from '../repositories/permission.repository'
import { RolePermissionService } from './rolePermission.service'

@Injectable()
export class PermissionService extends BaseService {
  public repository: Repository<PermissionEntity>
  public entity: Entity = PermissionEntity

  constructor(
    private connection: Connection,
    private rolePermission: RolePermissionService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(PermissionRepository)
  }

  /**
   * Create permission and return permission entity
   *
   * @param data  CreatePermissionDto
   *
   * @return Permission
   */
  async createPermission(data: CreatePermissionDto): Promise<PermissionEntity> {
    if (data.name) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    return this.create(data)
  }

  /**
   * Update permission and return permission entity
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

    if (data.name) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    return this.update(id, data)
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

    await this.rolePermission.destroy({ permissionId: id })

    await this.destroy(id)
  }
}
