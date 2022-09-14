import { BaseTimeStampEntity } from '../../base.entity';
import { Entity, OneToMany } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CartItem } from './cartItem.entity';

@Notifiable()
@Entity({ name: 'carts' })
export class CartEntity extends BaseTimeStampEntity {
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  public items: CartItem[];
}
