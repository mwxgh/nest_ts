import { JwtCustomService } from '@authModule/services/jwt.service'
import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@userModule/services/user.service'
import { AppGateway } from './app.gateway'
import { GatewayRoomNamingStrategy } from './gatewayRoomNaming.strategy'

export const gatewayProviders = [
  AppGateway,
  JwtCustomService,
  UserService,
  ConfigService,
  GatewayRoomNamingStrategy,
  RoleService,
  UserRoleService,
]
