import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
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
