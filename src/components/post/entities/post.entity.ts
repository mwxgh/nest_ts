import { CommentEntity } from '../../comment/entities/comment.entity'
import { OneToMany, Entity, Column } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CategoryAbleEntity } from '../../category/entities/categoryAble.entity'
import { TagAbleEntity } from '../../tag/entities/tagAble.entity'
import { TimeStampEntity } from '../../base.entity'
import { ImageAbleEntity } from '../../image/entities/imageAble.entity'

export enum JoinPostAbleType {
  images = 'posts.images',
  comments = 'posts.comments',
  tags = 'posts.tags',
  categories = 'posts.categories',
}

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
@Entity({ name: 'posts' })
export class PostEntity extends TimeStampEntity {
  @Column()
  title: string

  @Column()
  slug: string

  @Column()
  summary: string

  @Column()
  description: string

  @Column({ type: 'varchar', default: '' })
  content: string

  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus

  @Column({ type: 'enum', enum: PostPriority })
  priority: PostPriority

  @Column({ type: 'enum', enum: PostType })
  type: PostType

  @Column({ type: 'enum', enum: PostPrivacy })
  privacy: PostPrivacy

  @Column({ type: 'date' })
  releaseDate: Date

  @OneToMany(() => TagAbleEntity, (tag) => tag.post)
  tags: TagAbleEntity[]

  @OneToMany(() => CategoryAbleEntity, (category) => category.post)
  categories: CategoryAbleEntity[]

  @OneToMany(() => ImageAbleEntity, (imageAble) => imageAble.post)
  images: ImageAbleEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[]
}
