import { Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'userRole' })
export class UserRoleEntity {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  roleId: number
}
