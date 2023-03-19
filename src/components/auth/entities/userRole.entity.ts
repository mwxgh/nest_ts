import { Entity, PrimaryColumn } from 'typeorm'
import { IdEntity } from '../../../shared/entities/base.entity'

@Entity({ name: 'userRole' })
export class UserRoleEntity {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  roleId: number
}
