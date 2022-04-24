import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { TimeStampEntity } from '../../base.entity';
import { Contact } from '../../contact/entities/contact.entity';

@Notifiable()
@Entity({ name: 'users' })
export class User extends TimeStampEntity {
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

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'varchar' })
  socketId: string;

  @Column({ type: 'varchar', default: '' })
  verifyToken: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, { cascade: ['insert'] })
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
  roles: Role[];

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
