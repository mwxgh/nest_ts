import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { Product } from '../../product/entities/product.entity';
import { PostAble } from '../../post/entities/post.entity';
import { TimeStampEntity } from '../../base.entity';

export const ImageAbleType = {
  product: 'PRODUCT',
  post: 'POST',
} as const;

@Notifiable()
@Entity({ name: 'images' })
export class Image extends TimeStampEntity {
  @Column({ type: 'varchar', default: "''" })
  url: string;

  @Column({ name: 'imageAbleId', type: 'int' })
  public imageAbleId: number;

  @Column({ name: 'imageAbleType', type: 'varchar' })
  public imageAbleType: string;

  @Column({ type: 'int', default: 0 })
  public isThumbnail: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  public product: Product;

  @ManyToOne(() => PostAble, (post) => post.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  public post: PostAble;
}
