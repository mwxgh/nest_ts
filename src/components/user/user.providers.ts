import { UserService } from './services/user.service';
import { InviteUserService } from './services/inviteUser.service';
import { NotificationService } from 'src/shared/services/notification/notification.service';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
];
