import { TimeStampEntity } from '../../base.entity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'roles' })
export class Role extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToMany(() => UserEntity)
  users: Role[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
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
  permissions: Permission[];
}
