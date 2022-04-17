import { UserService } from './services/user.service';
import { InviteUserService } from './services/inviteUser.service';

export const userProviders = [UserService, InviteUserService];
