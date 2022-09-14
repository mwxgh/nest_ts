import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { TagAbleEntity, TagAbleType } from '../entities/tagAble.entity';
import { TagAbleRepository } from '../repositories/tagAble.repository';
import { TagService } from './tag.service';

@Injectable()
export class TagAbleService extends BaseService {
  public tagAbleRepository: Repository<any>;
  public entity: any = TagAbleEntity;
  constructor(private dataSource: Connection, private tagService: TagService) {
    super();
    this.tagAbleRepository =
      this.dataSource.getCustomRepository(TagAbleRepository);
  }

  /**
   * Attach tagAble when crate or update product, post, ...
   * @param params tagId
   * @param params tagAbleId
   * @param params tagAbleType
   */
  async attachTagAble(
    ...rest: {
      tagId: number;
      tagAbleId: number;
      tagAbleType: TagAbleType;
    }[]
  ): Promise<void> {
    rest.forEach(async (restItem: any) => {
      const { tagId, tagAbleId, tagAbleType } = restItem;

      const tagAble = new TagAbleEntity();

      tagAble.tagId = tagId;
      tagAble.tagAbleId = tagAbleId;
      tagAble.tagAbleType = tagAbleType;

      await this.tagAbleRepository.save(tagAble);
    });
  }

  /**
   * Detach tagAble when delete tag
   * All product, post, ... need to remove foreign key to this tag
   * @param params tagId
   */
  async detachTagAble(params: { tagId: number });

  /**
   * Detach tagAble when delete product, post, ...
   * Some tag need to remove foreign key to this product, post
   * @param params tagAbleId
   * @param params tagAbleType
   */
  async detachTagAble(params: { tagAbleId: number; tagAbleType: string });

  /**
   * Detach tagAble
   * @param params tagId
   * @param params tagAbleId
   * @param params tagAbleType
   */
  async detachTagAble(params: {
    tagId?: number;
    tagAbleId?: number;
    tagAbleType?: string;
  }): Promise<void> {
    const tagAblesExisting = await this.tagAbleRepository.find({
      where: params,
    });

    if (tagAblesExisting.length > 0) {
      await this.tagAbleRepository.delete(
        tagAblesExisting.map((tag) => tag.id),
      );
    }
  }
}
