import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { UserService } from './services/user.service'

export const userProviders = [
  UserService,
  ApiResponseService,
  NotificationService,
]
