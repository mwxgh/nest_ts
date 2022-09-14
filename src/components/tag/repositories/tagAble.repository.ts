import { EntityRepository, Repository } from 'typeorm';
import { TagAbleEntity } from '../entities/tagAble.entity';

@EntityRepository(TagAbleEntity)
export class TagAbleRepository extends Repository<TagAbleEntity> {}
