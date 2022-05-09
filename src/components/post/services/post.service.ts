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

  async queryPost(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    includes?: any;
    sortBy?: string;
    sortType?: 'ASC' | 'DESC';
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
      sortBy,
      sortType,
      privacy,
      status,
      priority,
      type,
    } = params;

    let baseQuery = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    });

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
