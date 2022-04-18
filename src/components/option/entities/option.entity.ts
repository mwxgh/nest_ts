import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity } from 'typeorm';
import { TimeStampEntity } from '../../base.entity';

@Notifiable()
@Entity({ name: 'options' })
export class Option extends TimeStampEntity {
  @Column({ type: 'varchar', default: "''" })
  key: string;

  @Column({ type: 'varchar', default: "''" })
  value: string;
}
