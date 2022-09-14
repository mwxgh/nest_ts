import { ProductEntity } from '../../../../src/components/product/entities/product.entity';
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TagEntity } from './tag.entity';
import { PostAble } from '../../post/entities/post.entity';
import { TimeStampEntity } from '../../base.entity';

export const TagAbleType = {
  post: 'POST',
  product: 'PRODUCT',
} as const;

@Notifiable()
@Entity({ name: 'tagAbles' })
export class TagAbleEntity extends TimeStampEntity {
  @Column({ name: 'tagId', type: 'int' })
  tagId: number;

  @Column({ name: 'tagAbleId', type: 'int' })
  tagAbleId: number;

  @Column({ name: 'tagAbleType', type: 'varchar' })
  tagAbleType: string;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => TagEntity, (tag) => tag.tagAbles)
  @JoinColumn({
    name: 'tagId',
    referencedColumnName: 'id',
  })
  tag: TagEntity;

  @ManyToOne(() => PostAble, (post) => post.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public post: PostAble;

  @ManyToOne(() => ProductEntity, (product) => product.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public product: ProductEntity;
}
