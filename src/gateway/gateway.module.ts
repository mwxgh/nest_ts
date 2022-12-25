import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { gatewayProviders } from './gateway.providers'

@Module({
  imports: [ConfigModule],
  providers: [...gatewayProviders],
})
export class GatewayModule {}
