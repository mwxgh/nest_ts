import { Comment } from '../../comment/entities/comment.entity';
import { Image } from '../../image/entities/image.entity';
import {
  OneToMany,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CategoryAble } from '../../category/entities/categoryAble.entity';
import { TagAble } from '../../tag/entities/tagAble.entity';

export enum JoinPostAbleType {
  images = 'posts.images',
  comments = 'posts.comments',
  tags = 'posts.tags',
  categories = 'posts.categories',
}

@Notifiable()
@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

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

  @Column({ type: 'int', default: 0 })
  status: number;

  @Column({ type: 'varchar', default: '' })
  type: string;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => TagAble, (tag) => tag.post)
  tags: TagAble[];

  @OneToMany(() => CategoryAble, (category) => category.post)
  categories: CategoryAble[];
}
