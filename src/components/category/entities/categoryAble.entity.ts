import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from '../../../components/product/entities/product.entity';
import { CategoryEntity } from './category.entity';
import { PostEntity } from '../../post/entities/post.entity';
import { TimeStampEntity } from '../../base.entity';

export enum CategoryAbleType {
  product = 'PRODUCT',
  post = 'POST',
}

@Notifiable()
@Entity({ name: 'categoryAble' })
export class CategoryAbleEntity extends TimeStampEntity {
  @Column({ type: 'int' })
  public categoryId: number;

  @Column({ type: 'int' })
  public categoryAbleId: number;

  @Column({ type: 'varchar', enum: CategoryAbleType })
  public categoryAbleType: CategoryAbleType;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.categoryAbles)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  category: CategoryEntity;

  @ManyToOne(() => ProductEntity, (product) => product.categories)
  @JoinColumn({
    name: 'categoryAbleId',
    referencedColumnName: 'id',
  })
  product: ProductEntity;

  @ManyToOne(() => PostEntity, (post) => post.categories)
  @JoinColumn({
    name: 'categoryAbleId',
    referencedColumnName: 'id',
  })
  post: PostEntity;
}
