import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../base.entity'
import { ImageEntity } from './image.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { PostEntity } from '../../post/entities/post.entity'

export enum ImageAbleType {
  product = 'PRODUCT',
  post = 'POST',
}

@Notifiable()
@Entity({ name: 'imageAble' })
export class ImageAbleEntity extends TimeStampEntity {
  @Column({ name: 'imageId', type: 'int' })
  public imageId: number

  @Column({ name: 'imageAbleId', type: 'int' })
  public imageAbleId: number

  @Column({ name: 'imageAbleType', type: 'enum', enum: ImageAbleType })
  public imageAbleType: ImageAbleType

  @Column({ type: 'int', default: 0 })
  public isThumbnail: number

  @ManyToOne(() => ImageEntity, (image) => image.imageAbles)
  @JoinColumn({
    name: 'imageId',
    referencedColumnName: 'id',
  })
  image: ImageEntity

  @ManyToOne(() => ProductEntity, (product) => product.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  product: ProductEntity

  @ManyToOne(() => PostEntity, (post) => post.images)
  @JoinColumn({
    name: 'imageAbleId',
    referencedColumnName: 'id',
  })
  post: PostEntity
}
