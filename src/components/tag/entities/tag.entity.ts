import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, OneToMany } from 'typeorm';
import { TagAble } from './tagAble.entity';
import { TimeStampEntity } from '../../base.entity';

export const StatusTag = {
  publish: 'PUBLISH',
  hide: 'HIDE',
} as const;

@Notifiable()
@Entity({ name: 'tags' })
export class TagName extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', enum: StatusTag })
  status: string;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => TagAble, (tagAbles) => tagAbles.tag)
  tagAbles: TagAble[];
}
