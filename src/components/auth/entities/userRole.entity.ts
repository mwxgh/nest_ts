import { IdEntity } from '../../base.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'userRole' })
export class UserRole extends IdEntity {
  @Column()
  userId: number;

  @Column()
  roleId: number;
}
