import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ProfileModule } from '@profileModule/profile.module'
import { UserModule } from '@userModule/user.module'
import { jwtConfig } from 'config/jwt.config'
import { authProviders } from './auth.providers'
import { AuthController } from './controllers/auth.controller'
import { ForgotPasswordController } from './controllers/forgotPassword/forgotPassword.controller'
import { PermissionController } from './controllers/permission/permission.controller'
import { RoleController } from './controllers/role/role.controller'
import { RoleService } from './services/role.service'
import { UserRoleService } from './services/userRole.service'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtConfig),
    forwardRef(() => UserModule),
    forwardRef(() => ProfileModule),
  ],
  providers: [...authProviders],
  controllers: [
    AuthController,
    ForgotPasswordController,
    PermissionController,
    RoleController,
  ],
  exports: [UserRoleService, RoleService],
})
export class AuthModule {}
