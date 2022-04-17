import { Entity, Column } from 'typeorm';

@Entity({ name: 'rolePermission' })
export class RolePermission {
  @Column()
  roleId: number;

  @Column()
  permissionId: number;
}
