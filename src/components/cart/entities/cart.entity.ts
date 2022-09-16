import { BaseTimeStampEntity } from '../../base.entity'
import { Entity, OneToMany } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CartItemEntity } from './cartItem.entity'

@Notifiable()
@Entity({ name: 'carts' })
export class CartEntity extends BaseTimeStampEntity {
  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  public items: CartItemEntity[]
}
