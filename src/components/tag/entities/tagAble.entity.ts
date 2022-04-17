import { Product } from '../../../../src/components/product/entities/product.entity';
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TagName } from './tag.entity';
import { Post } from 'src/components/post/entities/post.entity';
import { TimeStampEntity } from 'src/components/base/entities/base.entity';

@Notifiable()
@Entity({ name: 'tagAbles' })
export class TagAble extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'tagId', type: 'int' })
  tagId: number;

  @Column({ type: 'int' })
  status: number;

  @Column({ name: 'tagAbleId', type: 'int' })
  tagAbleId: number;

  @Column({ name: 'tagAbleType', type: 'varchar' })
  tagAbleType: string;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToOne(() => TagName, (tag) => tag.tagAbles)
  @JoinColumn({
    name: 'tagId',
    referencedColumnName: 'id',
  })
  tag: TagName;

  @ManyToOne(() => Post, (post) => post.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public post: Post;

  @ManyToOne(() => Product, (product) => product.tags)
  @JoinColumn({
    name: 'tagAbleId',
    referencedColumnName: 'id',
  })
  public product: Product;
}
