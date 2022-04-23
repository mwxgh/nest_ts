import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Repository, Connection, UpdateResult } from 'typeorm';
import { JoinPostAbleType, PostAble } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService extends BaseService {
  public repository: Repository<any>;
  public entity: any = PostAble;

  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(PostRepository);
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

  async queryPost(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    includes?: any;
    privacy?: string;
    status?: string;
    priority?: string;
    type?: string;
  }): Promise<any> {
    const {
      entity,
      fields,
      keyword,
      includes,
      privacy,
      status,
      priority,
      type,
    } = params;

    let baseQuery = await this.queryBuilder({ entity, fields, keyword });

    if (privacy && privacy !== '') {
      baseQuery = baseQuery.andWhere('posts.privacy = :privacy', {
        privacy,
      });
    }

    if (status && status !== '') {
      baseQuery = baseQuery.andWhere('posts.status = :status', {
        status,
      });
    }

    if (priority && priority !== '') {
      baseQuery = baseQuery.andWhere('posts.priority = :priority', {
        priority,
      });
    }

    if (type && type !== '') {
      baseQuery = baseQuery.andWhere('posts.type = :type', {
        type,
      });
    }

    const keys = Object.keys(JoinPostAbleType);

    const values = Object.values(JoinPostAbleType);

    const value = [];

    let include = [];

    if (includes) {
      const arr = includes.split(',');

      include = [...arr];

      arr.forEach((el) => {
        if (keys.includes(el)) value.push(values[`${keys.indexOf(el)}`]);
      });
      const key = arr.filter((item) => keys.includes(item));

      for (let i = 0; i < key.length; i++) {
        baseQuery = baseQuery.leftJoinAndSelect(`${value[i]}`, `${key[i]}`);
      }

      // query category detail
      if (include.includes('categories'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `categories.category`,
          `category`,
        );
      // query tag detail
      if (include.includes('tags'))
        baseQuery = baseQuery.leftJoinAndSelect(`tags.tag`, `tag`);
    }
    return baseQuery;
  }
}
