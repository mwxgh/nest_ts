import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ProductEntity } from '../../product/entities/product.entity'
import { AbleEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { CategoryEntity } from './category.entity'

@Notifiable()
@Entity({ name: 'categoryAble' })
export class CategoryAbleEntity extends AbleEntity {
  @PrimaryColumn({ type: 'int' })
  public categoryId: number

  @ManyToOne(() => CategoryEntity, (category) => category.categoryAbles)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  category: CategoryEntity

  @ManyToOne(() => ProductEntity, (product) => product.categories)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  product: ProductEntity

  @ManyToOne(() => PostEntity, (post) => post.categories)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  post: PostEntity
}
