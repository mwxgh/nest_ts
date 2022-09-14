import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { TimeStampEntity } from '../../base.entity';
import { Image } from './image.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { PostAble } from '../../post/entities/post.entity';
export const ImageAbleType = {
  product: 'PRODUCT',
  post: 'POST',
} as const;

@Notifiable()
@Entity({ name: 'imageAbles' })
export class ImageAble extends TimeStampEntity {
  @Column({ name: 'imageAbleId', type: 'int' })
  public imageAbleId: number;

  @Column({ name: 'imageAbleType', type: 'varchar' })
  public imageAbleType: string;

  @Column({ type: 'int', default: 0 })
  public isThumbnail: number;

  @ManyToOne(() => Image, (image) => image.imageAbles)
  @JoinColumn({
    name: 'imageId',
    referencedColumnName: 'id',
  })
  image: Image;

  @ManyToOne(() => ProductEntity, (product) => product.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  product: ProductEntity;

  @ManyToOne(() => PostAble, (post) => post.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  post: PostAble;
}
