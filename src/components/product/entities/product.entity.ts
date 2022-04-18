import { Entity, Column, OneToMany } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Image } from '../../image/entities/image.entity';
import { CartItem } from '../../../components/cart/entities/cartItem.entity';
import { Comment } from '../../../components/comment/entities/comment.entity';
import { CategoryAble } from '../../category/entities/categoryAble.entity';
import { TagAble } from '../../tag/entities/tagAble.entity';
import { OrderProduct } from '../../order/entities/orderProduct.entity';
import { TimeStampEntity } from '../../base.entity';

@Notifiable()
@Entity({ name: 'products' })
export class Product extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  sku: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'int', default: 0 })
  originalPrice: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => OrderProduct, (orderItem) => orderItem.products)
  orders: OrderProduct[];

  @OneToMany(() => CategoryAble, (categoryAble) => categoryAble.product)
  public categories!: CategoryAble[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  products: Promise<CartItem[]>;

  @OneToMany(() => TagAble, (tag) => tag.product)
  tags: TagAble[];
}
