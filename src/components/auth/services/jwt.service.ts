import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserService } from '@userModule/services/user.service'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class JwtCustomService {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // private readonly jwtService: JwtService,
  ) {}

  async verify(token: string, isWs = false): Promise<UserEntity | null> {
    try {
      const payload = <any>jwt.verify(token, this.configService.get('APP_KEY'))

      const user = await this.userService.findOneOrFail(payload.id)

      if (!user) {
        if (isWs) {
          throw new WsException('Unauthorized access')
        } else {
          throw new HttpException('Unauthorized access', HttpStatus.BAD_REQUEST)
        }
      }
      return user
    } catch (err) {
      if (isWs) {
        throw new WsException(err.message)
      } else {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      }
    }
  }
}
