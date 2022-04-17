import { Entity, Column } from 'typeorm';

@Entity({ name: 'userRole' })
export class UserRole {
  @Column()
  userId: number;

  @Column()
  roleId: number;
}
