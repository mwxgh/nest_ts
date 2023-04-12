import { CategoryEntity } from '@categoryModule/entities/category.entity'
import { CategoryAbleEntity } from '@categoryModule/entities/categoryAble.entity'
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'
import { CartItemEntity } from '../../../components/cart/entities/cartItem.entity'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { ImageAbleEntity } from '../../image/entities/imageAble.entity'
import { OrderProductEntity } from '../../order/entities/orderProduct.entity'
import { TagAbleEntity } from '../../tag/entities/tagAble.entity'

export enum ProductStatus {
  inventory = 'INVENTORY',
  outOfStock = 'OUT_OF_STOCK',
  hide = 'HIDE',
}

@Notifiable()
@Entity({ name: 'product' })
export class ProductEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true })
  sku: string

  @Column({ type: 'varchar', unique: true })
  slug: string

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.inventory,
  })
  status: ProductStatus

  @Column({ type: 'int', default: 0 })
  originalPrice: number

  @Column({ type: 'int', default: 0 })
  price: number

  @Column({ type: 'int', default: 0 })
  quantity: number

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  categories: CategoryEntity[]

  @OneToMany(() => CategoryAbleEntity, (categoryAble) => categoryAble.product)
  categoryAbles: CategoryAbleEntity[]

  @OneToMany(() => TagAbleEntity, (tag) => tag.product)
  tags: TagAbleEntity[]

  @OneToMany(() => ImageAbleEntity, (imageAble) => imageAble.product)
  images: ImageAbleEntity[]

  @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.products)
  orders: OrderProductEntity[]

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  products: Promise<CartItemEntity[]>
}
