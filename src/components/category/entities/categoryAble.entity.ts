import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../../components/product/entities/product.entity';
import { Category } from './category.entity';
import { Post } from '../../post/entities/post.entity';

export enum CategoryAbleType {
  PRODUCT = 'products',
  POST = 'posts',
}

@Notifiable()
@Entity({ name: 'categoryAble' })
export class CategoryAble {
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

  @Column({ type: 'int' })
  public categoryId: number;

  @Column({ type: 'int' })
  public categoryAbleId: number;

  @Column({ type: 'varchar' })
  public categoryAbleType: string;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => Product, (product) => product.categories)
  @JoinColumn({
    name: 'categoryAbleId',
  })
  product: Product;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({
    name: 'categoryId',
  })
  category: Category;

  @ManyToOne(() => Post, (post) => post.categories)
  @JoinColumn({
    name: 'categoryAbleId',
  })
  post: Post;
}
