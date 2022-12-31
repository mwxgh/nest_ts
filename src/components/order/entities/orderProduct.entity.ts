import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { BaseTimeStampEntity } from '../../base.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { OrderEntity } from './order.entity'

@Notifiable()
@Entity({ name: 'orderProduct' })
export class OrderProductEntity extends BaseTimeStampEntity {
  @Column({ type: 'int', name: 'productId' })
  public productId: number

  @Column({ type: 'int', name: 'orderId' })
  public orderId: number

  @Column({ type: 'int' })
  quantity: number

  @Column({ type: 'int' })
  amount: number

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  @JoinColumn({
    name: 'productId',
  })
  products: ProductEntity

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({
    name: 'orderId',
  })
  orders: OrderEntity
}
