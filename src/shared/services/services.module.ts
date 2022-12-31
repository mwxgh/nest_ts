import { Global, Module } from '@nestjs/common'
import { ApiResponseService } from './apiResponse/apiResponse.service'
import { HashService } from './hash/hash.service'
import { NotificationModule } from './notification/notification.module'

@Global()
@Module({
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService],
  imports: [NotificationModule],
})
export class ServicesModule {}
