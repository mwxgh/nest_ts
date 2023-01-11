import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { authProviders } from './auth.providers'
import { AuthController } from './controllers/auth.controller'
import { ForgotPasswordController } from './controllers/forgotPassword/forgotPassword.controller'
import { PermissionController } from './controllers/permission/permission.controller'
import { RoleController } from './controllers/role/role.controller'
import { jwtConfig } from 'config/jwt.config'

@Module({
  imports: [ConfigModule, JwtModule.registerAsync(jwtConfig)],
  providers: [...authProviders],
  controllers: [
    AuthController,
    ForgotPasswordController,
    PermissionController,
    RoleController,
  ],
})
export class AuthModule {}
