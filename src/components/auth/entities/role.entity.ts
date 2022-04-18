import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToMany(() => User)
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
