import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { TagEntity } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class TagService extends BaseService {
  public repository: Repository<any>;
  public entity: any = TagEntity;
  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(TagRepository);
  }

  async queryTag(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    sortBy?: string;
    sortType?: 'ASC' | 'DESC';
  }) {
    const { entity, fields, keyword, sortBy, sortType } = params;

    const baseQuery = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    });

    const tagQuery = baseQuery
      .leftJoinAndSelect('tags.tagAbles', 'tagAbles')
      .leftJoinAndSelect('tagAbles.post', 'posts')
      .leftJoinAndSelect('tagAbles.product', 'products');

    return tagQuery;
  }
}
