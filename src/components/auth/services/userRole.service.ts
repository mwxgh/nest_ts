import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { UserRoleEntity } from '../entities/userRole.entity'
import { UserRoleRepository } from '../repositories/userRole.repository'

@Injectable()
export class UserRoleService extends BaseService {
  public repository: Repository<any>
  public entity: any = UserRoleEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(UserRoleRepository)
  }
}
