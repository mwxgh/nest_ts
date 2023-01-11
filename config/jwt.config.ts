import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions } from '@nestjs/jwt'

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('APP_KEY'),
    signOptions: {
      expiresIn: configService.get('JWT_TTL'),
    },
  }),
  inject: [ConfigService],
}
