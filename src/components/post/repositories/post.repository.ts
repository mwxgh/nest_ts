import { EntityRepository, Repository } from 'typeorm';
import { PostAble } from '../entities/post.entity';

@EntityRepository(PostAble)
export class PostRepository extends Repository<PostAble> {}
