import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { RoleEntity } from '../../auth/entities/role.entity';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { TimeStampEntity } from '../../base.entity';
import { Contact } from '../../contact/entities/contact.entity';

export const UserStatus = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
} as const;

@Notifiable()
@Entity({ name: 'users' })
export class UserEntity extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: '' })
  firstName: string;

  @Column({ type: 'varchar', default: '' })
  lastName: string;

  @Column({ type: 'varchar', enum: UserStatus })
  status: string;

  @Column({ type: 'varchar' })
  socketId: string;

  @Column({ type: 'varchar', default: '' })
  verifyToken: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: ['insert'] })
  @JoinTable({
    name: 'userRole',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  getEmail(): string {
    return this.email;
  }

  generateVerifyEmailLink(baseUrl: string): string {
    const path = `/auth/verify?token=${this.verifyToken}`;
    const url = new URL(path, baseUrl);
    return url.href;
  }
}
