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

  async queryInclude(query: any) {
    const include = [];

    if (query.include) {
      const arr = query.include.split(',');
      arr.map((i: any) => include.push(i));
    }

    let query_builder = this.repository.createQueryBuilder('categories');

    if (include.includes('products')) {
      query_builder = query_builder.where('categories.categoryType = :type', {
        type: CategoryAbleType.PRODUCT,
      });
    }

    if (include.includes('posts')) {
      query_builder = query_builder.where('categories.categoryType = :type', {
        type: CategoryAbleType.POST,
      });
    }
    return query_builder;
  }
}
