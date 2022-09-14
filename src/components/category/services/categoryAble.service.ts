import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { CategoryAbleEntity } from '../entities/categoryAble.entity';
import { CategoryAbleRepository } from '../repositories/categoryAble.repository';

@Injectable()
export class CategoryAbleService extends BaseService {
  public categoryAbleRepository: Repository<any>;
  public entity: any = CategoryAbleEntity;
  constructor(private dataSource: Connection) {
    super();
    this.categoryAbleRepository = this.dataSource.getCustomRepository(
      CategoryAbleRepository,
    );
  }
}
