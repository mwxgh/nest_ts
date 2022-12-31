import { ImageAbleType } from '@imageModule/entities/imageAble.entity'
import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { OrderEntity } from '../entities/order.entity'
import { OrderRepository } from '../repositories/order.repository'

@Injectable()
export class OrderService extends BaseService {
  public repository: Repository<any>
  public entity: any = OrderEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(OrderRepository)
  }

  async baseQuery(id?: any): Promise<any> {
    const query_builder = id
      ? await this.repository
          .createQueryBuilder('orders')
          .where('orders.id = :id', { id: id })
      : await this.repository.createQueryBuilder('orders')

    if (id) {
      await query_builder
        .leftJoinAndSelect('orders.items', 'orderItems')
        .leftJoinAndSelect('orderItems.products', 'products')
        .leftJoinAndSelect(
          'products.images',
          'images',
          'imageAbleType = :imageAbleType',
          { imageAbleType: ImageAbleType.product },
        )
    }

    return { query_builder }
  }
}
