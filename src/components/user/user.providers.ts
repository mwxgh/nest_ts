import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { InviteUserService } from './services/inviteUser.service'
import { UserService } from './services/user.service'

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
]
