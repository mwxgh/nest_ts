import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { ImageAble } from '../entities/imageAble.entity';
import { ImageAbleRepository } from '../repositories/imageAble.repository';

@Injectable()
export class ImageAbleService extends BaseService {
  public repository: Repository<any>;
  public entity: any = ImageAble;

  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(ImageAbleRepository);
  }
}
