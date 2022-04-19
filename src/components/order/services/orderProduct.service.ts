import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { OrderProduct } from '../entities/orderProduct.entity';

import { OrderProductRepository } from '../repositories/orderProduct.repository';

@Injectable()
export class OrderProductService extends BaseService {
  public repository: Repository<any>;
  public entity: any = OrderProduct;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(
      OrderProductRepository,
    );
  }
}
