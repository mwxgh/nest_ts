import { Comment } from '../../comment/entities/comment.entity';
import { Image } from '../../image/entities/image.entity';
import { OneToMany, Entity, Column } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CategoryAble } from '../../category/entities/categoryAble.entity';
import { TagAble } from '../../tag/entities/tagAble.entity';
import { TimeStampEntity } from '../../base.entity';

export const JoinPostAbleType = {
  images: 'posts.images',
  comments: 'posts.comments',
  tags: 'posts.tags',
  categories: 'posts.categories',
} as const;

export const StatusPost = {
  draft: 'DRAFT',
  pending: 'PENDING',
  publish: 'PUBLISH',
  hide: 'HIDE',
} as const;

export const PriorityPost = {
  highest: 'HIGHEST',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
} as const;

export const TypePost = {
  gallery: 'GALLERY',
  sidebar: 'SIDEBAR',
  content: 'CONTENT',
} as const;

export const PrivacyPost = {
  public: 'PUBLIC',
  system: 'SYSTEM',
  protected: 'PROTECTED',
  private: 'PRIVATE',
} as const;

@Notifiable()
@Entity({ name: 'posts' })
export class PostAble extends TimeStampEntity {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column({ type: 'varchar', default: '' })
  content: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  priority: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  privacy: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => TagAble, (tag) => tag.post)
  tags: TagAble[];

  @OneToMany(() => CategoryAble, (category) => category.post)
  categories: CategoryAble[];
}
