import { Post } from 'src/components/post/entities/post.entity';
import {
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Product } from '../../product/entities/product.entity';

export enum CommentAbleType {
  PRODUCT = 'products',
  POST = 'posts',
}

export enum JoinCommentAble {
  products = 'comments.product',
  posts = 'comments.post',
}

@Notifiable()
@Entity({ name: 'comments' })
export class Comment {
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

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  contacts: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ name: 'commentAbleId', type: 'int' })
  commentAbleId: number;

  @Column({ name: 'commentAbleType', type: 'int' })
  commentAbleType: string;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({
    name: 'commentAbleId',
    referencedColumnName: 'id',
  })
  public product: Product;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({
    name: 'commentAbleId',
    referencedColumnName: 'id',
  })
  public post: Post;
}
