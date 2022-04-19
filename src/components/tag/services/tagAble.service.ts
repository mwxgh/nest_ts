import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { TagAble } from '../entities/tagAble.entity';
import { TagAbleRepository } from '../repositories/tagAble.repository';

@Injectable()
export class TagAbleService extends BaseService {
  public tagAbleRepository: Repository<any>;
  public entity: any = TagAble;
  constructor(private dataSource: Connection) {
    super();
    this.tagAbleRepository =
      this.dataSource.getCustomRepository(TagAbleRepository);
  }

  async store(data: any): Promise<TagAble> {
    return this.tagAbleRepository.save(data);
  }

  //update tagAble from update post
  async update(id: number, data: any): Promise<UpdateResult> {
    return await this.tagAbleRepository.update(Number(id), {
      ...data,
      updatedAt: new Date(),
    });
  }

  async destroyTagAble(data: any) {
    return await this.tagAbleRepository.delete(data);
  }
}
