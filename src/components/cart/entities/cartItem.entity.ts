import { Product } from '../../../components/product/entities/product.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Cart } from './cart.entity';

@Notifiable()
@Entity({ name: 'cartItems' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  @Column({ name: 'productId', type: 'int' })
  public productId: number;

  @Column({ name: 'cartId', type: 'int' })
  public cartId: number;

  @Column({ type: 'int' })
  quantity: string;

  @Column({ type: 'int' })
  amount: string;

  @ManyToOne(() => Product, (product) => product.products)
  @JoinColumn({
    name: 'productId',
  })
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({
    name: 'cartId',
  })
  cart: Cart;
}
