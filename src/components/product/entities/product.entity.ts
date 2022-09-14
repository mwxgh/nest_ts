import { Entity, Column, OneToMany } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CartItemEntity } from '../../../components/cart/entities/cartItem.entity';
import { Comment } from '../../../components/comment/entities/comment.entity';
import { CategoryAbleEntity } from '../../category/entities/categoryAble.entity';
import { TagAble } from '../../tag/entities/tagAble.entity';
import { OrderProductEntity } from '../../order/entities/orderProduct.entity';
import { TimeStampEntity } from '../../base.entity';
import { ImageAble } from '../../image/entities/imageAble.entity';

export const StatusProduct = {
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

  @Column({ type: 'varchar', enum: StatusProduct, default: 'INVENTORY' })
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

  @OneToMany(() => TagAble, (tag) => tag.product)
  tags: TagAble[];

  @OneToMany(() => ImageAble, (imageAble) => imageAble.product)
  images: ImageAble[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.products)
  orders: OrderProductEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  products: Promise<CartItemEntity[]>;
}
