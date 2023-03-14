import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionRepository } from '../repositories/permission.repository'
import { Entity } from '@shared/interfaces/response.interface'

@Injectable()
export class PermissionService extends BaseService {
  public repository: Repository<PermissionEntity>
  public entity: Entity = PermissionEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(PermissionRepository)
  }
}
