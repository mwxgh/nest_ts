import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { ImageEntity } from './image.entity'

export enum ImageAbleType {
  product = 'PRODUCT',
  post = 'POST',
}

export enum ImageAbleStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}

@Notifiable()
@Entity({ name: 'imageAble' })
export class ImageAbleEntity extends TimeStampEntity {
  @Column({ type: 'int' })
  public imageId: number

  @Column({ type: 'int' })
  public imageAbleId: number

  @Column({ type: 'enum', enum: ImageAbleType })
  public imageAbleType: ImageAbleType

  @Column({ type: 'int', default: 0 })
  public isThumbnail: number

  @Column({ type: 'enum', enum: ImageAbleStatus })
  public status: ImageAbleStatus

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
