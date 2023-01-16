import { Entity, OneToMany } from 'typeorm'
import { BaseTimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CartItemEntity } from './cartItem.entity'

@Notifiable()
@Entity({ name: 'cart' })
export class CartEntity extends BaseTimeStampEntity {
  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  public items: CartItemEntity[]
}
