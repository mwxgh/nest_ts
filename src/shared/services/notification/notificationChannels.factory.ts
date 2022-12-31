import { IChannel, INotificationChannelFactory } from './interfaces'

export class NotificationChannelFactory implements INotificationChannelFactory {
  registerChannel(): IChannel[] | [] {
    return []
  }
}
