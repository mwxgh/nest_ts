import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rolePermission' })
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  permissionId: number;
}
