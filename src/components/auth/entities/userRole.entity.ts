import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'userRole' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roleId: number;
}
