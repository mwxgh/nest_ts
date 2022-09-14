import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { CartItemEntity } from '../entities/cartItem.entity';
import { CartItemRepository } from '../repositories/cartItem.repository';
@Injectable()
export class CartItemService extends BaseService {
  public repository: Repository<any>;
  public entity: any = CartItemEntity;
  constructor(private dataSource: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(CartItemRepository);
  }
}
