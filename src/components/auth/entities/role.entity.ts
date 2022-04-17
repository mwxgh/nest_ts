import { TimeStampEntity } from 'src/components/base/entities/base.entity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'roles' })
export class Role extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToMany(() => User)
  users: Role[];
}
