import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<any>
  public entity: any = RoleEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(RoleRepository)
  }
}
