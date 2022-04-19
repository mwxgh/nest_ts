import { Injectable } from '@nestjs/common';
import { Comment } from '../../../components/comment/entities/comment.entity';
import { CommentRepository } from 'src/components/comment/repositories/comment.repository';
import { BaseService } from 'src/shared/services/base.service';
import { Repository, Connection, UpdateResult, getRepository } from 'typeorm';
import { JoinPostAbleType, PostAble } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService extends BaseService {
  public postRepository: Repository<any>;
  public postEntity: any = PostAble;
  public commentRepository: Repository<any>;
  public commentEntity: any = Comment;

  constructor(
    private postDataSource: Connection,
    private commentDataSource: Connection,
  ) {
    super();
    this.postRepository =
      this.postDataSource.getCustomRepository(PostRepository);
    this.commentRepository =
      this.commentDataSource.getCustomRepository(CommentRepository);
  }

  async destroyPost(id) {
    return this.postRepository.delete(id);
  }

  async store(data: any): Promise<PostAble> {
    return await this.postRepository.save(data);
  }
  async list(): Promise<PostAble[]> {
    return await this.postRepository.find();
  }
  async show(id: any): Promise<PostAble> {
    return await this.postRepository.findOne(id);
  }
  async update(id: number, data: any): Promise<UpdateResult> {
    delete data.url;
    delete data.is_thumbnail;
    return await this.postRepository.update(Number(id), {
      ...data,
      updated_at: new Date(),
    });
  }
  async posts(): Promise<any> {
    return await this.postRepository;
  }

  async JoinTable(data?: any): Promise<any> {
    const keys = Object.keys(JoinPostAbleType);
    const values = Object.values(JoinPostAbleType);
    // const key = [];
    const value = [];
    let include = [];
    let join = this.postRepository.createQueryBuilder('posts');
    if (data.include) {
      const arr = data.include.split(',');
      include = [...arr];
      arr.forEach((el) => {
        if (keys.includes(el)) value.push(values[`${keys.indexOf(el)}`]);
        // if (keys.includes(el)) key.push(el);
      });
      const key = arr.filter((item) => keys.includes(item));
      // const value = arr.filter((item) => keys.includes(item));
      for (let i = 0; i < key.length; i++) {
        join = join.leftJoinAndSelect(`${value[i]}`, `${key[i]}`);
      }
      if (include.includes('categories'))
        join = join.leftJoinAndSelect(`categories.category`, `category`);
    }
    return join;
  }
}
