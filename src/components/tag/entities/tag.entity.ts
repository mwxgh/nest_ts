import { Column, Entity, OneToMany } from 'typeorm'
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { TagAbleEntity } from './tagAble.entity'

export enum TagStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}

@Notifiable()
@Entity({ name: 'tag' })
export class TagEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'enum', enum: TagStatus, default: TagStatus.publish })
  status: TagStatus

  @OneToMany(() => TagAbleEntity, (tagAbles) => tagAbles.tag)
  tagAbles: TagAbleEntity[]
}
