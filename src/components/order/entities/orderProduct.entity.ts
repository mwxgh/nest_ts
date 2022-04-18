import { Product } from '../../product/entities/product.entity';
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
import { Order } from './order.entity';

@Notifiable()
@Entity({ name: 'orderProducts' })
export class OrderProduct {
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

  @Column({ type: 'int', name: 'productId' })
  public productId: number;

  @Column({ type: 'int', name: 'orderId' })
  public orderId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  amount: number;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({
    name: 'productId',
  })
  products: Product;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({
    name: 'orderId',
  })
  orders: Order;
}
