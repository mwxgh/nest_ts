import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Repository, Connection } from 'typeorm'
import { RolePermissionEntity } from '../entities/rolePermission.entity'
import { RolePermissionRepository } from '../repositories/rolePermission.repository'

@Injectable()
export class RolePermissionService extends BaseService {
  public repository: Repository<any>
  public entity: any = RolePermissionEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(RolePermissionRepository)
  }
}
