import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { CategoryAbleEntity } from './categoryAble.entity'

export enum CategoryStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}
@Notifiable()
@Entity({ name: 'category' })
export class CategoryEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  categoryType: string

  @Column({ name: 'parentId', type: 'int' })
  public parentId: number

  @Column({ type: 'enum', enum: CategoryStatus })
  status: CategoryStatus

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @OneToMany(() => CategoryEntity, (cate) => cate.children)
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'id',
  })
  children: CategoryEntity[]

  @OneToMany(
    () => CategoryAbleEntity,
    (categoryAbles) => categoryAbles.category,
  )
  categoryAbles: CategoryAbleEntity[]
}
