import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { ProductEntity } from '../../product/entities/product.entity'
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

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: CategoryEntity

  @OneToMany(() => CategoryEntity, (cate) => cate.children)
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
