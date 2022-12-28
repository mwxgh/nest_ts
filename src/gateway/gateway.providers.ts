import { JwtCustomService } from '@authModule/services/jwt.service'
import { AppGateway } from './app.gateway'
import { UserService } from '@userModule/services/user.service'
import { ConfigService } from '@nestjs/config'
import { GatewayRoomNamingStrategy } from './gatewayRoomNaming.strategy'
import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'

export const gatewayProviders = [
  AppGateway,
  JwtCustomService,
  UserService,
  ConfigService,
  GatewayRoomNamingStrategy,
  RoleService,
  UserRoleService,
]
