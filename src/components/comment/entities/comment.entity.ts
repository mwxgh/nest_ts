import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../base.entity'
import { PostEntity } from '../../post/entities/post.entity'
import { ProductEntity } from '../../product/entities/product.entity'

export enum CommentAbleType {
  product = 'PRODUCT',
  post = 'POST',
}

export enum CommentStatus {
  pending = 'PENDING',
  forward = 'FORWARD',
  publish = 'PUBLISH',
  hide = 'HIDE',
}

export enum JoinCommentAble {
  products = 'comments.product',
  posts = 'comments.post',
}

@Notifiable()
@Entity({ name: 'comment' })
export class CommentEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'varchar' })
  fullName: string

  @Column({ type: 'varchar' })
  contact: string

  @Column({ type: 'enum', enum: CommentStatus })
  status: CommentStatus

  @Column({ name: 'commentAbleId', type: 'int' })
  commentAbleId: number

  @Column({ name: 'commentAbleType', type: 'int' })
  commentAbleType: string

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @ManyToOne(() => ProductEntity, (product) => product.comments)
  @JoinColumn({
    name: 'commentAbleId',
    referencedColumnName: 'id',
  })
  public product: ProductEntity

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({
    name: 'commentAbleId',
    referencedColumnName: 'id',
  })
  public post: PostEntity
}
