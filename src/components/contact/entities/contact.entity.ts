import { TimeStampEntity } from '../../base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { UserEntity } from '../../user/entities/user.entity';

export enum ContactStatus {
  default = 'DEFAULT',
  normal = 'NORMAL',
}
@Notifiable()
@Entity({ name: 'contacts' })
export class ContactEntity extends TimeStampEntity {
  @Column({ type: 'number' })
  userId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'int' })
  phone: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  note: string;

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.normal })
  status: ContactStatus;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.contacts)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  public user: UserEntity;
}
