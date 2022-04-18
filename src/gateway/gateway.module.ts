import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { UserService } from '../components/user/services/user.service';
import { JwtService } from '../components/auth/services/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayRoomNamingStrategy } from './gateway-room-naming.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    AppGateway,
    JwtService,
    UserService,
    ConfigService,
    GatewayRoomNamingStrategy,
  ],
})
export class GatewayModule {}
