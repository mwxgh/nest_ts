import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { RoleEntity } from './role.entity'

@Entity({ name: 'permission' })
export class PermissionEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @ManyToMany(() => RoleEntity, (role) => role.permissions, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'rolePermission',
    joinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[]
}
