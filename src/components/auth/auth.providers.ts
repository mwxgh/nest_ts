import { userProviders } from '@userModule/user.providers'
import { AuthService } from './services/auth.service'
import { JwtCustomService } from './services/jwt.service'
import { PasswordResetService } from './services/passwordReset.service'
import { PermissionService } from './services/permission.service'
import { RoleService } from './services/role.service'
import { RolePermissionService } from './services/rolePermission.service'
import { UserRoleService } from './services/userRole.service'
import { JwtStrategy } from './strategies/jwt.strategy'

export const authProviders = [
  ...userProviders,
  JwtStrategy,
  PasswordResetService,
  PermissionService,
  RoleService,
  RolePermissionService,
  UserRoleService,
  AuthService,
  JwtCustomService,
]
