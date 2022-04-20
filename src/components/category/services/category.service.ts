import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryAbleType } from '../entities/categoryAble.entity';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Category;

  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(CategoryRepository);
  }

  async queryCategory(entity: string, includes: any) {
    const include = [];

    if (includes) {
      const arr = includes.split(',');
      arr.map((i: any) => include.push(i));
    }

    let baseQuery = await this.queryBuilder(entity);

    if (include.includes('products')) {
      baseQuery = baseQuery.where(`${entity}.categoryType = :type`, {
        type: CategoryAbleType.PRODUCT,
      });
    }

    if (include.includes('posts')) {
      baseQuery = baseQuery.where(`${entity}.categoryType = :type`, {
        type: CategoryAbleType.POST,
      });
    }
    return baseQuery;
  }
}
