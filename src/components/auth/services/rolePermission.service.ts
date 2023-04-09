import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { RolePermissionEntity } from '../entities/rolePermission.entity'
import { RolePermissionRepository } from '../repositories/rolePermission.repository'

@Injectable()
export class RolePermissionService extends BaseService {
  public repository: Repository<RolePermissionEntity>
  public entity: Entity = RolePermissionEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(RolePermissionRepository)
  }
}
