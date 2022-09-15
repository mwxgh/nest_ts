import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { ImageAbleEntity } from '../entities/imageAble.entity';
import { ImageAbleRepository } from '../repositories/imageAble.repository';

@Injectable()
export class ImageAbleService extends BaseService {
  public repository: Repository<any>;
  public entity: any = ImageAbleEntity;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(ImageAbleRepository);
  }
}
