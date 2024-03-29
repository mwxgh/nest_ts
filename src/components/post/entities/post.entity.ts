import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CategoryEntity } from '../../category/entities/category.entity'
import { CategoryAbleEntity } from '../../category/entities/categoryAble.entity'
import { CommentEntity } from '../../comment/entities/comment.entity'
import { ImageAbleEntity } from '../../image/entities/imageAble.entity'
import { ReactionEntity } from '../../reaction/entities/reaction.entity'
import { TagAbleEntity } from '../../tag/entities/tagAble.entity'

export enum PostStatus {
  draft = 'DRAFT',
  pending = 'PENDING',
  publish = 'PUBLISH',
  hide = 'HIDE',
}

export enum PostPriority {
  highest = 'HIGHEST',
  high = 'HIGH',
  medium = 'MEDIUM',
  low = 'LOW',
}

export enum PostType {
  gallery = 'GALLERY',
  sidebar = 'SIDEBAR',
  content = 'CONTENT',
}

export enum PostPrivacy {
  public = 'PUBLIC',
  system = 'SYSTEM',
  protected = 'PROTECTED',
  private = 'PRIVATE',
}

@Notifiable()
@Entity({ name: 'post' })
export class PostEntity extends TimeStampEntity {
  @Column()
  title: string

  @Column()
  slug: string

  @Column()
  summary: string

  @Column()
  description: string

  @Column({ type: 'varchar' })
  content: string

  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus

  @Column({ type: 'enum', enum: PostPriority })
  priority: PostPriority

  @Column({ type: 'enum', enum: PostType })
  type: PostType

  @Column({ type: 'enum', enum: PostPrivacy })
  privacy: PostPrivacy

  @Column({ type: 'timestamp' })
  releaseDate: Date

  @OneToMany(() => TagAbleEntity, (tag) => tag.post)
  tags: TagAbleEntity[]

  @ManyToMany(() => CategoryEntity, (category) => category.posts)
  categories: CategoryEntity[]

  @OneToMany(() => CategoryAbleEntity, (categoryAble) => categoryAble.post)
  categoryAbles: CategoryAbleEntity[]

  @OneToMany(() => ImageAbleEntity, (imageAble) => imageAble.post)
  images: ImageAbleEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[]

  @OneToMany(() => ReactionEntity, (reaction) => reaction.post)
  reactions: ReactionEntity[]
}
