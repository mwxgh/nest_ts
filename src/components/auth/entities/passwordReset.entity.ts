import { Column, Entity } from 'typeorm'
import { BaseTimeStampEntity } from '../../../shared/entities/base.entity'

@Entity({ name: 'passwordReset' })
export class PasswordResetEntity extends BaseTimeStampEntity {
  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'varchar' })
  token: string

  @Column({ type: 'timestamp' })
  expire: Date

  generatePasswordResetLink(base_url: string): string {
    const path = `auth/reset?token=${this.token}`
    const url = new URL(path, base_url)
    return url.href
  }

  generateExpirePasswordResetLink(base_url: string): string {
    const path = `auth/expire?token=${this.token}`
    const url = new URL(path, base_url)
    return url.href
  }
}
