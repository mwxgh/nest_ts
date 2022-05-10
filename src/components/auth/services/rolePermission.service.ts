import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { RolePermission } from '../entities/rolePermission.entity';
import { RolePermissionRepository } from '../repositories/rolePermission.repository';

@Injectable()
export class RolePermissionService extends BaseService {
  public repository: Repository<any>;
  public entity: any = RolePermission;

  constructor(private dataSource: Connection) {
    super();
    this.repository = dataSource.getCustomRepository(RolePermissionRepository);
  }
}
