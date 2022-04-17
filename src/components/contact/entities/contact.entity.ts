import { TimeStampEntity } from 'src/components/base/entities/base.entity';
import { Entity, Column } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';

@Notifiable()
@Entity({ name: 'contacts' })
export class Contact extends TimeStampEntity {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'int' })
  phone: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  note: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;
}
