import { Entity, PrimaryColumn } from 'typeorm'
import { IdEntity } from '../../../shared/entities/base.entity'

@Entity({ name: 'rolePermission' })
export class RolePermissionEntity {
  @PrimaryColumn()
  roleId: number

  @PrimaryColumn()
  permissionId: number
}
