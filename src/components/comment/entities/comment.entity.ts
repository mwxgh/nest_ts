import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

export enum CommentStatus {
  pending = 'PENDING',
  forward = 'FORWARD',
  publish = 'PUBLISH',
  hide = 'HIDE',
}

@Notifiable()
@Entity({ name: 'comment' })
export class CommentEntity extends TimeStampEntity {
  @Column({ name: 'userId', type: 'int' })
  userId: number

  @Column({ name: 'postId', type: 'int' })
  postId: number

  @Column({ name: 'content', type: 'varchar' })
  content: string

  @Column({ type: 'enum', enum: CommentStatus })
  status: CommentStatus

  @Column({ name: 'parentId', type: 'int' })
  public parentId: number

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @OneToMany(() => CommentEntity, (comment) => comment.children)
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'id',
  })
  children: CommentEntity[]

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({
    name: 'postId',
    referencedColumnName: 'id',
  })
  public post: PostEntity

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  public user: UserEntity
}
