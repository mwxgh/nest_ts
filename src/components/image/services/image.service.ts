import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { ImageRepository } from '../repositories/image.reponsitory';

@Injectable()
export class ImageService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Image;

  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(ImageRepository);
  }
}
