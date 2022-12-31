import { Column, Entity } from 'typeorm'
import { IdEntity } from '../../base.entity'

@Entity({ name: 'userRole' })
export class UserRoleEntity extends IdEntity {
  @Column()
  userId: number

  @Column()
  roleId: number
}
