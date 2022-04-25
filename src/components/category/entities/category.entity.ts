import { TimeStampEntity } from '../../base.entity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { CategoryAble } from './categoryAble.entity';

@Notifiable()
@Entity({ name: 'categories' })
export class Category extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  categoryType: string;

  @Column({ name: 'parentId', type: 'int' })
  public parentId: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => Category, (cate) => cate.children)
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'id',
  })
  children: Category[];

  @OneToMany(() => CategoryAble, (categoryAbles) => categoryAbles.category)
  categoryAbles: CategoryAble[];
}
