import { MAIL } from '@sharedServices/notification/channels/email/constants'
import {
  IMailable,
  Mailable,
} from '@sharedServices/notification/channels/email/mailable'
import { Notification } from '@sharedServices/notification/notification'

export class UserPasswordChangedNotification extends Notification {
  public password: string
  constructor(password: string) {
    super()
    this.password = password
  }
  via(): string[] {
    return [MAIL]
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to(this.notifiable.email)
      .greeting('Hello')
      .subject('Your Account Password is changed')
      .line(`Your password: <b>${this.password}</b>`)
      .line(
        'If you did not make this request, contact to admin for more information.',
      )
  }
}
