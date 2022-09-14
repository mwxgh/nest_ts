import { Entity, Column, OneToMany } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CartItemEntity } from '../../../components/cart/entities/cartItem.entity';
import { CommentEntity } from '../../../components/comment/entities/comment.entity';
import { CategoryAbleEntity } from '../../category/entities/categoryAble.entity';
import { TagAbleEntity } from '../../tag/entities/tagAble.entity';
import { OrderProductEntity } from '../../order/entities/orderProduct.entity';
import { TimeStampEntity } from '../../base.entity';
import { ImageAbleEntity } from '../../image/entities/imageAble.entity';

export const ProductStatus = {
  inventory: 'INVENTORY',
  outOfStock: 'OUT_OF_STOCK',
  hide: 'HIDE',
} as const;

@Notifiable()
@Entity({ name: 'products' })
export class ProductEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  sku: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', enum: ProductStatus, default: 'INVENTORY' })
  status: string;

  @Column({ type: 'int', default: 0 })
  originalPrice: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => CategoryAbleEntity, (categoryAble) => categoryAble.product)
  public categories!: CategoryAbleEntity[];

  @OneToMany(() => TagAbleEntity, (tag) => tag.product)
  tags: TagAbleEntity[];

  @OneToMany(() => ImageAbleEntity, (imageAble) => imageAble.product)
  images: ImageAbleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.product)
  comments: CommentEntity[];

  @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.products)
  orders: OrderProductEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  products: Promise<CartItemEntity[]>;
}
