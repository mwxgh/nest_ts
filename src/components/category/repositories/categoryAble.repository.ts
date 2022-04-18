import { EntityRepository, Repository } from 'typeorm';
import { CategoryAble } from '../entities/categoryAble.entity';

@EntityRepository(CategoryAble)
export class CategoryAbleRepository extends Repository<CategoryAble> {}
