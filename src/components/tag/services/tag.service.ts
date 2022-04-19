import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { TagName } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class TagService extends BaseService {
  public repository: Repository<any>;
  public entity: any = TagName;
  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(TagRepository);
  }

  async queryTag() {
    const query_builder = this.repository
      .createQueryBuilder('tags')
      .leftJoinAndSelect('tags.tagAbles', 'tagAbles')
      .leftJoinAndSelect('tagAbles.post', 'posts')
      .leftJoinAndSelect('tagAbles.product', 'products');
    return query_builder;
  }
}
