import { MAIL } from '@sharedServices/notification/channels/email/constants'
import {
  Mailable,
  IMailable,
} from '@sharedServices/notification/channels/email/mailable'
import { Notification } from '@sharedServices/notification/notification'

export class VerifyUserNotification extends Notification {
  public url: string
  constructor(url: string) {
    super()
    this.url = url
  }
  via(): string[] {
    return [MAIL]
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to(this.notifiable.email)
      .greeting('Hello')
      .subject('Verify your ID email address')
      .line(
        'You have selected this email address as your new ID. To verify this email address belongs to you click to the button bellow and follow instruction',
      )
      .action('Verify', this.url)
      .line(
        'If you did not make this request, you can ignore this email. No ID will be created without verification.',
      )
  }
}
