import { Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'rolePermission' })
export class RolePermissionEntity {
  @PrimaryColumn()
  roleId: number

  @PrimaryColumn()
  permissionId: number
}
