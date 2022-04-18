import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { CategoryAble } from '../entities/categoryAble.entity';
import { CategoryAbleRepository } from '../repositories/categoryAble.repository';

@Injectable()
export class CategoryAbleService extends BaseService {
  public categoryAbleRepository: Repository<any>;
  public entity: any = CategoryAble;
  constructor(private dataSource: Connection) {
    super();
    this.categoryAbleRepository = this.dataSource.getCustomRepository(
      CategoryAbleRepository,
    );
  }

  async store(data: any): Promise<CategoryAble> {
    return this.categoryAbleRepository.save(data);
  }
  async destroyCategories(data: any) {
    return await this.categoryAbleRepository.delete(data);
  }
}
