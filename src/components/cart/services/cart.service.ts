import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartRepository } from '../repositories/cart.repository';
@Injectable()
export class CartService extends BaseService {
  public repository: Repository<any>;
  public entity: any = CartEntity;

  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(CartRepository);
  }

  async store(): Promise<any> {
    return this.repository.save({});
  }
}
