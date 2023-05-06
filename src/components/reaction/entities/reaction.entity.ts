import { CommentEntity } from '@commentModule/entities/comment.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

export enum ReactionAbleType {
  post = 'POST',
  comment = 'COMMENT',
}

export enum Reaction {
  like = 'LIKE',
  care = 'CARE',
  love = 'LOVE',
  haha = 'HAHA',
  wow = 'WOW',
  sad = 'SAD',
  angry = 'ANGRY',
}

@Notifiable()
@Entity({ name: 'reaction' })
@Index(['userId', 'ableId', 'ableType', 'reaction'], { unique: true })
export class ReactionEntity {
  @PrimaryColumn({ name: 'userId', type: 'int' })
  userId: number

  @PrimaryColumn({ name: 'ableId', type: 'int' })
  ableId: number

  @Column({ name: 'ableType', type: 'enum', enum: ReactionAbleType })
  ableType: ReactionAbleType

  @Column({ name: 'reaction', type: 'enum', enum: Reaction })
  reaction: Reaction

  @ManyToOne(() => UserEntity, (user) => user.reactions)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: UserEntity

  @ManyToOne(() => PostEntity, (post) => post.reactions)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  post: PostEntity

  @ManyToOne(() => CommentEntity, (comment) => comment.reactions)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  comment: CommentEntity
}
