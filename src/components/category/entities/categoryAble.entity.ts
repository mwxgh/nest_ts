import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '../../../components/product/entities/product.entity';
import { Category } from './category.entity';
import { PostAble } from '../../post/entities/post.entity';
import { TimeStampEntity } from '../../base.entity';

export const CategoryAbleType = {
  product: 'PRODUCT',
  post: 'POST',
} as const;

@Notifiable()
@Entity({ name: 'categoryAble' })
export class CategoryAble extends TimeStampEntity {
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

  @ManyToOne(() => PostAble, (post) => post.categories)
  @JoinColumn({
    name: 'categoryAbleId',
  })
  post: PostAble;
}
