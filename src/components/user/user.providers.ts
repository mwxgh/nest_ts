import { UserService } from './services/user.service'
import { InviteUserService } from './services/inviteUser.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { CommonService } from '@sharedServices/common.service'

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
  RoleService,
  UserRoleService,
  CommonService,
]
