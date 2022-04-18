import { Product } from '../../../../src/components/product/entities/product.entity';
import { Notifiable } from '../../../../src/shared/services/notification/decorators/notifiable.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TagName } from './tag.entity';
import { Post } from 'src/components/post/entities/post.entity';

@Notifiable()
@Entity({ name: 'tagAbles' })
export class TagAble {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

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
