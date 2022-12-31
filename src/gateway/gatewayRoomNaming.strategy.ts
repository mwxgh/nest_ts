import { Injectable } from '@nestjs/common'
import { UserEntity } from '@userModule/entities/user.entity'

@Injectable()
export class GatewayRoomNamingStrategy {
  userPrivateChannel(user: UserEntity): string {
    return `App.Entity.${user.id}`
  }
}
