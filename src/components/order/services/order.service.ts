import { Injectable } from '@nestjs/common';
import { ImageAbleType } from 'src/components/image/entities/image.entity';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Order;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(OrderRepository);
  }

  async baseQuery(id?: any): Promise<any> {
    const query_builder = id
      ? await this.repository
          .createQueryBuilder('orders')
          .where('orders.id = :id', { id: id })
      : await this.repository.createQueryBuilder('orders');

    if (id) {
      await query_builder
        .leftJoinAndSelect('orders.items', 'orderItems')
        .leftJoinAndSelect('orderItems.products', 'products')
        .leftJoinAndSelect(
          'products.images',
          'images',
          'imageAbleType = :imageAbleType',
          { imageAbleType: ImageAbleType.PRODUCT },
        );
    }

    return { query_builder };
  }
}
