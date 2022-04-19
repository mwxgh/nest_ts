import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { ImageRepository } from '../repositories/image.reponsitory';

@Injectable()
export class ImageService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Image;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(ImageRepository);
  }

  // api product admin: GET, POST, PUT, DELETE
  async image(): Promise<any> {
    return await this.repository;
  }
}
