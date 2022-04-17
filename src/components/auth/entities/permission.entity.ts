import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

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
}
