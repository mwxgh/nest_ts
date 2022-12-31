import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ProductEntity } from '../../../../src/components/product/entities/product.entity'
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../base.entity'
import { PostEntity } from '../../post/entities/post.entity'
import { TagEntity } from './tag.entity'

export enum TagAbleType {
  post = 'POST',
  product = 'PRODUCT',
}

@Notifiable()
@Entity({ name: 'tagAble' })
export class TagAbleEntity extends TimeStampEntity {
  @Column({ name: 'tagId', type: 'int' })
  tagId: number

  @Column({ name: 'tagAbleId', type: 'int' })
  tagAbleId: number

  @Column({ name: 'tagAbleType', type: 'enum', enum: TagAbleType })
  tagAbleType: TagAbleType

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @ManyToOne(() => TagEntity, (tag) => tag.tagAbles)
  @JoinColumn({
    name: 'tagId',
    referencedColumnName: 'id',
  })
  tag: TagEntity

  @ManyToOne(() => PostEntity, (post) => post.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public post: PostEntity

  @ManyToOne(() => ProductEntity, (product) => product.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public product: ProductEntity
}
