import { EntityRepository, Repository } from 'typeorm';
import { CategoryAbleEntity } from '../entities/categoryAble.entity';

@EntityRepository(CategoryAbleEntity)
export class CategoryAbleRepository extends Repository<CategoryAbleEntity> {}
