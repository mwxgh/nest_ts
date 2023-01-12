import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'config/jwt.config'
import { authProviders } from './auth.providers'
import { AuthController } from './controllers/auth.controller'
import { ForgotPasswordController } from './controllers/forgotPassword/forgotPassword.controller'
import { PermissionController } from './controllers/permission/permission.controller'
import { RoleController } from './controllers/role/role.controller'

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
