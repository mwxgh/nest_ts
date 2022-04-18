import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, OneToMany } from 'typeorm';
import { TagAble } from './tagAble.entity';
import { TimeStampEntity } from '../../base.entity';

@Notifiable()
@Entity({ name: 'tags' })
export class TagName extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => TagAble, (tagAbles) => tagAbles.tag)
  tagAbles: TagAble[];
}
