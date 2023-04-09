import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { UserRoleEntity } from '../entities/userRole.entity'
import { UserRoleRepository } from '../repositories/userRole.repository'

@Injectable()
export class UserRoleService extends BaseService {
  public repository: Repository<UserRoleEntity>
  public entity: Entity = UserRoleEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(UserRoleRepository)
  }
}
