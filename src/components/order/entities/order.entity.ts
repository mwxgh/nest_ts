import { Column, Entity, OneToMany } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { BaseTimeStampEntity } from '../../base.entity'
import { OrderProductEntity } from './orderProduct.entity'

@Notifiable()
@Entity({ name: 'order' })
export class OrderEntity extends BaseTimeStampEntity {
  @Column({ type: 'varchar', name: 'fullName' })
  fullName: string

  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'int' })
  phoneNumber: number

  @Column({ type: 'varchar' })
  address: string

  @Column({ type: 'varchar' })
  note: string

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'int', default: 1 })
  status: number

  @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.orders)
  items: OrderProductEntity[]
}
