import { userProviders } from '@userModule/user.providers'
import { PasswordResetService } from './services/passwordReset.service'
import { PermissionService } from './services/permission.service'
import { RoleService } from './services/role.service'
import { RolePermissionService } from './services/rolePermission.service'
import { UserRoleService } from './services/userRole.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthService } from './services/auth.service'

export const authProviders = [
  ...userProviders,
  JwtStrategy,
  PasswordResetService,
  PermissionService,
  RoleService,
  RolePermissionService,
  UserRoleService,
  AuthService,
]
