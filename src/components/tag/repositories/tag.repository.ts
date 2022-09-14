import { EntityRepository, Repository } from 'typeorm';
import { TagEntity } from '../entities/tag.entity';

@EntityRepository(TagEntity)
export class TagRepository extends Repository<TagEntity> {}
