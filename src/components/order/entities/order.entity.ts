import { BaseTimeStampEntity } from '../../base.entity';
import { Entity, OneToMany, Column } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { OrderProduct } from './orderProduct.entity';

@Notifiable()
@Entity({ name: 'orders' })
export class Order extends BaseTimeStampEntity {
  @Column({ type: 'varchar', name: 'fullName' })
  fullName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'int' })
  phoneNumber: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  note: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @OneToMany(() => OrderProduct, (orderItem) => orderItem.orders)
  items: OrderProduct[];
}
