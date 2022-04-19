import { EntityRepository, Repository } from 'typeorm';
import { TagAble } from '../entities/tagAble.entity';

@EntityRepository(TagAble)
export class TagAbleRepository extends Repository<TagAble> {}
