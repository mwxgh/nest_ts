import { Injectable, UnauthorizedException } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { UserService } from '@userModule/services/user.service'
import { UserLoginDto, UserRegisterDto } from '../dto/auth.dto'
import { pick } from 'lodash'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from '@userModule/entities/user.entity'
import { AttributeAuthentication } from '@authModule/interfaces/auth.interface'

@Injectable()
export class AuthService extends BaseService {
  private authenticatedUserFields = ['id', 'email']
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super()
  }

  private _generateToken(params: Partial<UserEntity>): AttributeAuthentication {
    const token = this.jwtService.sign(params)
    return {
      token,
      expiresIn: process.env.JWT_TTL,
    }
  }

  async register(params: UserRegisterDto): Promise<AttributeAuthentication> {
    const user = await this.userService.saveUser({
      data: params,
    })

    const partialUserProperties: Partial<UserEntity> = pick(
      user,
      this.authenticatedUserFields,
    )

    return this._generateToken(partialUserProperties)
  }

  async login(params: UserLoginDto): Promise<AttributeAuthentication> {
    const { email, password } = params

    const user: Partial<UserEntity> = await this.userService.firstOrFail({
      where: {
        email: this.userService.sanitizeEmail(email),
      },
      select: [...this.authenticatedUserFields, 'password'],
    })

    const isValidPassword = this.userService.checkPassword(
      password,
      user.password,
    )

    if (isValidPassword != true) {
      throw new UnauthorizedException('Password does not match')
    }

    const partialUserProperties: Partial<UserEntity> = pick(
      user,
      this.authenticatedUserFields,
    )

    return this._generateToken(partialUserProperties)
  }
}
