import { Column, Entity } from 'typeorm'
import { IdEntity } from '../../base.entity'

@Entity({ name: 'rolePermission' })
export class RolePermissionEntity extends IdEntity {
  @Column()
  roleId: number

  @Column()
  permissionId: number
}
