import { PostAble } from '../../post/entities/post.entity';
import { JoinColumn, ManyToOne, Entity, Column } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Product } from '../../product/entities/product.entity';
import { TimeStampEntity } from '../../base.entity';

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
export class Comment extends TimeStampEntity {
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

  @ManyToOne(() => PostAble, (post) => post.comments)
  @JoinColumn({
    name: 'commentAbleId',
    referencedColumnName: 'id',
  })
  public post: PostAble;
}
