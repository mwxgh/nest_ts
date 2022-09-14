import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from '../../../components/product/entities/product.entity';
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

  @ManyToOne(() => Category, (category) => category.categoryAbles)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  category: Category;

  @ManyToOne(() => ProductEntity, (product) => product.categories)
  @JoinColumn({
    name: 'categoryAbleId',
    referencedColumnName: 'id',
  })
  product: ProductEntity;

  @ManyToOne(() => PostAble, (post) => post.categories)
  @JoinColumn({
    name: 'categoryAbleId',
    referencedColumnName: 'id',
  })
  post: PostAble;
}
