import { TimeStampEntity } from '../../base.entity'
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { PermissionEntity } from './permission.entity'

@Entity({ name: 'role' })
export class RoleEntity extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', unique: true })
  slug: string

  @Column({ type: 'int' })
  level: number

  @ManyToMany(() => UserEntity)
  users: RoleEntity[]

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'rolePermission',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionEntity[]
}
