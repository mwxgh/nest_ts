import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { Connection, Repository } from 'typeorm'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserRepository } from '@userModule/repositories/user.repository'

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>
  public entity: any = UserEntity

  constructor(
    private connection: Connection,
    private hashService: HashService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(UserRepository)
  }
}
