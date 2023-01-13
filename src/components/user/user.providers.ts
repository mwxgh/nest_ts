import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { PrimitiveService } from '@sharedServices/primitive.service'
import { InviteUserService } from './services/inviteUser.service'
import { UserService } from './services/user.service'

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
  RoleService,
  UserRoleService,
  PrimitiveService,
]
