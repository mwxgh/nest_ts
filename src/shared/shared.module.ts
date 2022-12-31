/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ApiResponseService } from './services/apiResponse/apiResponse.service'
import { HashService } from './services/hash/hash.service'
import { EmailChannel } from './services/notification/channels/email/email.channel'
import { NotificationModule } from './services/notification/notification.module'

@Global()
@Module({
  imports: [
    NotificationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        channels: [
          EmailChannel.config({
            host: configService.get('MAIL_HOST'),
            port: configService.get('MAIL_PORT'),
            secure: Number(configService.get('MAIL_PORT')) === 465,
            auth: {
              user: configService.get('MAIL_USERNAME'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService, HashService],
})
export class SharedModule {}
