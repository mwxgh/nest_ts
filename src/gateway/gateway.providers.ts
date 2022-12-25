import { JwtCustomService } from 'src/components/auth/services/jwt.service'
import { AppGateway } from './app.gateway'
import { UserService } from 'src/components/user/services/user.service'
import { ConfigService } from '@nestjs/config'
import { GatewayRoomNamingStrategy } from './gatewayRoomNaming.strategy'
import { RoleService } from 'src/components/auth/services/role.service'
import { UserRoleService } from 'src/components/auth/services/userRole.service'

export const gatewayProviders = [
  AppGateway,
  JwtCustomService,
  UserService,
  ConfigService,
  GatewayRoomNamingStrategy,
  RoleService,
  UserRoleService,
]
