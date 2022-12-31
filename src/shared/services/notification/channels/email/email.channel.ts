/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { get } from 'lodash'
import * as nodemailer from 'nodemailer'
import { INotification } from '../../interfaces'
import { IChannel } from '../../interfaces/channel.interface'
import { MAIL } from './constants'

export function getEmail(field: string): string {
  return get(this, field)
}

@Injectable()
export class EmailChannel implements IChannel {
  public name: string
  public transporter: any

  constructor(options) {
    const { name, transporter } = options
    this.name = name
    this.transporter = transporter
  }

  public static config(options) {
    const transporter = nodemailer.createTransport(options)
    return new EmailChannel({ name: MAIL, transporter })
  }

  async execute(notification: INotification): Promise<any> {
    const mailable = (notification as any).toMail(notification.notifiable)
    const result = await this.transporter.sendMail(mailable.getParams())
    return result
  }
}
