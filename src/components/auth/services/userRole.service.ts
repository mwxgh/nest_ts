import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { UserRoleEntity } from '../entities/userRole.entity';
import { UserRoleRepository } from '../repositories/userRole.repository';

@Injectable()
export class UserRoleService extends BaseService {
  public repository: Repository<any>;
  public entity: any = UserRoleEntity;

  constructor(private dataSource: Connection) {
    super();
    this.repository = dataSource.getCustomRepository(UserRoleRepository);
  }
}
