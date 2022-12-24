import { ProductEntity } from '../../../components/product/entities/product.entity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CartEntity } from './cart.entity'
import { BaseTimeStampEntity } from '../../base.entity'

@Notifiable()
@Entity({ name: 'cartItem' })
export class CartItemEntity extends BaseTimeStampEntity {
  @Column({ name: 'productId', type: 'int' })
  public productId: number

  @Column({ name: 'cartId', type: 'int' })
  public cartId: number

  @Column({ type: 'int' })
  quantity: string

  @Column({ type: 'int' })
  amount: string

  @ManyToOne(() => ProductEntity, (product) => product.products)
  @JoinColumn({
    name: 'productId',
  })
  product: ProductEntity

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({
    name: 'cartId',
  })
  cart: CartEntity
}
