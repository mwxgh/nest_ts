import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { TagAbleEntity } from '../entities/tagAble.entity';
import { TagAbleRepository } from '../repositories/tagAble.repository';

@Injectable()
export class TagAbleService extends BaseService {
  public tagAbleRepository: Repository<any>;
  public entity: any = TagAbleEntity;
  constructor(private dataSource: Connection) {
    super();
    this.tagAbleRepository =
      this.dataSource.getCustomRepository(TagAbleRepository);
  }

  //update tagAble from update post
  async update(id: number, data: any): Promise<UpdateResult> {
    return await this.tagAbleRepository.update(Number(id), {
      ...data,
      updatedAt: new Date(),
    });
  }

  async detachTagAble(params: {
    tagId?: number;
    tagAbleId?: number;
    tagAbleType?: string;
  }): Promise<void> {
    const { tagId, tagAbleId, tagAbleType } = params;

    if (tagId) {
      const tagsExisting = await this.tagAbleRepository.find({
        where: { tagId },
      });

      await this.tagAbleRepository.delete(tagsExisting.map((tag) => tag.id));
    }

    if (tagAbleId && tagAbleType) {
      const tagsExisting = await this.tagAbleRepository.find({
        where: { tagAbleId, tagAbleType },
      });

      await this.tagAbleRepository.delete(tagsExisting.map((tag) => tag.id));
    }
  }
}
