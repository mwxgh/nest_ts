import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { authProviders } from './auth.providers'
import { AuthController } from './controllers/auth.controller'
import { ForgotPasswordController } from './controllers/forgotPassword/forgotPassword.controller'
import { PermissionController } from './controllers/permission/permission.controller'
import { RoleController } from './controllers/role/role.controller'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...authProviders],
  controllers: [
    AuthController,
    ForgotPasswordController,
    PermissionController,
    RoleController,
  ],
})
export class AuthModule {}
