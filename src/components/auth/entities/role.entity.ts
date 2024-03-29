import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
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

  @ManyToMany(() => UserEntity, (user) => user.roles, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'userRole',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
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
