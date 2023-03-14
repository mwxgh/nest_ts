import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { RoleEntity } from '../../auth/entities/role.entity'

import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { ContactEntity } from '../../contact/entities/contact.entity'

export enum UserStatus {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

@Notifiable()
@Entity({ name: 'user' })
export class UserEntity extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  public email: string

  @Column({ type: 'varchar', unique: true })
  public username: string

  @Column({ type: 'varchar' })
  public password: string

  @Column({ type: 'varchar', default: '' })
  public firstName: string

  @Column({ type: 'varchar', default: '' })
  public lastName: string

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.active })
  public status: UserStatus

  @Column({ type: 'varchar' })
  public socketId: string

  @Column({ type: 'varchar' })
  public refreshToken: string

  @Column({ type: 'varchar', default: '' })
  public verifyToken: string

  @Column({ type: 'boolean', default: false })
  public verified: boolean

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

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
  roles: RoleEntity[]

  @OneToMany(() => ContactEntity, (contact) => contact.user)
  contacts: ContactEntity[]

  getEmail(): string {
    return this.email
  }

  getUsername(): string {
    return this.username
  }

  generateVerifyEmailLink(baseUrl: string): string {
    const path = `/auth/verify?token=${this.verifyToken}`
    const url = new URL(path, baseUrl)
    return url.href
  }
}
