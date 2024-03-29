import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { NOTIFICATION_CHANNELS, NOTIFICATION_OPTIONS } from './constants'
import {
  INotificationChannelFactory,
  NotificationAsyncOptions,
} from './interfaces'
import { NotificationService } from './notification.service'

export const channelFactory = {
  provide: NOTIFICATION_CHANNELS,
  useFactory: async (notificationService) => {
    return notificationService.register()
  },
  inject: [NotificationService],
}

export const optionFactory = {
  provide: NOTIFICATION_OPTIONS,
  useFactory: async (notificationService) => {
    return notificationService.register()
  },
  inject: [NotificationService],
}

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
  public static registerAsync(
    options: NotificationAsyncOptions,
  ): DynamicModule {
    return {
      module: NotificationModule,
      imports: options.imports || [],
      providers: [
        this.createConnectOptionsProvider(options),
        channelFactory,
        NotificationService,
      ],
      exports: [NotificationService, channelFactory, optionFactory],
    }
  }

  private static createConnectOptionsProvider(
    options: NotificationAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NOTIFICATION_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: NOTIFICATION_OPTIONS,
      useFactory: async (optionsFactory: INotificationChannelFactory) =>
        await optionsFactory.registerChannel(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
