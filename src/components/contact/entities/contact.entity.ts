import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { UserEntity } from '../../user/entities/user.entity'

export enum ContactType {
  priority = 'PRIORITY',
  normal = 'NORMAL',
}
@Notifiable()
@Entity({ name: 'contact' })
export class ContactEntity extends TimeStampEntity {
  @Column({ type: 'number' })
  userId: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  phone: number

  @Column({ type: 'varchar' })
  address: string

  @Column({ type: 'enum', enum: ContactType, default: ContactType.normal })
  type: ContactType

  @ManyToOne(() => UserEntity, (user) => user.contacts)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  public user: UserEntity
}
