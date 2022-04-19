import { EntityRepository, Repository } from 'typeorm';
import { TagName } from '../entities/tag.entity';

@EntityRepository(TagName)
export class TagRepository extends Repository<TagName> {}
