import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { ImageEntity } from './image.entity'

export enum ImageAbleType {
  product = 'PRODUCT',
  post = 'POST',
  comment = 'COMMENT',
}

@Notifiable()
@Entity({ name: 'imageAble' })
export class ImageAbleEntity {
  @PrimaryColumn({ name: 'ableId', type: 'int' })
  ableId: number

  @Column({ name: 'ableType', type: 'enum', enum: ImageAbleType })
  ableType: ImageAbleType

  @PrimaryColumn({ type: 'int' })
  public imageId: number

  @Column({ type: 'boolean', default: false })
  public isThumbnail: number

  @ManyToOne(() => ImageEntity, (image) => image.imageAbles)
  @JoinColumn({
    name: 'imageId',
    referencedColumnName: 'id',
  })
  image: ImageEntity

  @ManyToOne(() => ProductEntity, (product) => product.images)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  product: ProductEntity

  @ManyToOne(() => PostEntity, (post) => post.images)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  post: PostEntity
}
