import { ProductEntity } from '../../product/entities/product.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { OrderEntity } from './order.entity';
import { BaseTimeStampEntity } from '../../base.entity';

@Notifiable()
@Entity({ name: 'orderProducts' })
export class OrderProductEntity extends BaseTimeStampEntity {
  @Column({ type: 'int', name: 'productId' })
  public productId: number;

  @Column({ type: 'int', name: 'orderId' })
  public orderId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  amount: number;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  @JoinColumn({
    name: 'productId',
  })
  products: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({
    name: 'orderId',
  })
  orders: OrderEntity;
}
