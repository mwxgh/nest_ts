import { UserService } from './services/user.service';
import { InviteUserService } from './services/inviteUser.service';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { NotificationService } from 'src/shared/services/notification/notification.service';

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
];
