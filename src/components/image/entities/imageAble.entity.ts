import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { AbleEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { PostEntity } from '../../post/entities/post.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { ImageEntity } from './image.entity'

@Notifiable()
@Entity({ name: 'imageAble' })
export class ImageAbleEntity extends AbleEntity {
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
