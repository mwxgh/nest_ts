import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ProductEntity } from '../../../../src/components/product/entities/product.entity'
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator'
import { AbleEntity } from '../../../shared/entities/base.entity'
import { PostEntity } from '../../post/entities/post.entity'
import { TagEntity } from './tag.entity'

@Notifiable()
@Entity({ name: 'tagAble' })
export class TagAbleEntity extends AbleEntity {
  @PrimaryColumn({ name: 'tagId', type: 'int' })
  tagId: number

  @ManyToOne(() => TagEntity, (tag) => tag.tagAbles)
  @JoinColumn({
    name: 'tagId',
    referencedColumnName: 'id',
  })
  tag: TagEntity

  @ManyToOne(() => PostEntity, (post) => post.tags)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  public post: PostEntity

  @ManyToOne(() => ProductEntity, (product) => product.tags)
  @JoinColumn({
    name: 'ableId',
    referencedColumnName: 'id',
  })
  public product: ProductEntity
}
