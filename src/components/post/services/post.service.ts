import { Injectable } from '@nestjs/common';
import { Comment } from '../../../components/comment/entities/comment.entity';
import { CommentRepository } from 'src/components/comment/repositories/comment.repository';
import { BaseService } from 'src/shared/services/base.service';
import { Repository, Connection, UpdateResult } from 'typeorm';
import { JoinPostAbleType, PostAble } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService extends BaseService {
  public repository: Repository<any>;
  public entity: any = PostAble;

  constructor(private postDataSource: Connection) {
    super();
    this.repository = this.postDataSource.getCustomRepository(PostRepository);
  }

  async destroyPost(id: any) {
    return this.repository.delete(id);
  }

  async store(data: any): Promise<PostAble> {
    return await this.repository.save(data);
  }

  async update(id: number, data: any): Promise<UpdateResult> {
    delete data.url;
    delete data.is_thumbnail;
    return await this.repository.update(Number(id), {
      ...data,
      updated_at: new Date(),
    });
  }

  async posts(): Promise<any> {
    return await this.repository;
  }

  async JoinTable(data?: any): Promise<any> {
    const keys = Object.keys(JoinPostAbleType);
    const values = Object.values(JoinPostAbleType);
    // const key = [];
    const value = [];
    let include = [];
    let join = this.repository.createQueryBuilder('posts');
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
