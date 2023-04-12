import { PostEntity } from '@postModule/entities/post.entity'
import { ProductEntity } from '@productModule/entities/product.entity'
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CategoryAbleEntity } from './categoryAble.entity'

export enum CategoryStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}
@Notifiable()
@Entity({ name: 'category' })
export class CategoryEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ name: 'parentId', type: 'int' })
  public parentId: number

  @Column({ type: 'enum', enum: CategoryStatus })
  status: CategoryStatus

  @OneToMany(() => CategoryEntity, (cate) => cate.children)
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'id',
  })
  children: CategoryEntity[]

  @ManyToMany(() => PostEntity, (post) => post.categories)
  posts: PostEntity[]

  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[]

  @OneToMany(
    () => CategoryAbleEntity,
    (categoryAbles) => categoryAbles.category,
  )
  categoryAbles: CategoryAbleEntity[]
}
