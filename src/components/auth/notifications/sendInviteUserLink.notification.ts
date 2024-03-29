import { MAIL } from '@sharedServices/notification/channels/email/constants'
import {
  IMailable,
  Mailable,
} from '@sharedServices/notification/channels/email/mailable'
import { Notification } from '@sharedServices/notification/notification'
import { PasswordResetEntity } from '../entities/passwordReset.entity'

export class SendInviteUserLinkNotification extends Notification {
  public passwordReset: PasswordResetEntity
  public base_url: string

  constructor(passwordReset: PasswordResetEntity, base_url: string) {
    super()
    this.passwordReset = passwordReset
    this.base_url = base_url
  }

  via(): string[] {
    return [MAIL]
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to(this.notifiable.email)
      .subject(
        'Invite user requested for your Multiple Service Platform Account',
      )
      .greeting('Hi!')
      .line(
        `An invitation has been sent to your email: <a href="mailto:${this.notifiable.email}">${this.notifiable.email}</a>`,
      )
      .line(
        'If you follow the link below you will be able to personally reset your password.',
      )
      .action(
        'Reset your password',
        this.passwordReset.generatePasswordResetLink(this.base_url),
      )
      .line('The link will expire in 48 hours. Let contact for support')
      .line('Thank you for your patience.')
  }
}
