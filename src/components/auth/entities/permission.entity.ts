import { TimeStampEntity } from '../../base.entity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @ManyToMany(() => Role, (role) => role.permissions, { cascade: ['insert'] })
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
  roles: Role[];
}
