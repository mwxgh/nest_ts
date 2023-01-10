import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { UserService } from '@userModule/services/user.service'
import { LoginGoogleDto, UserLoginDto, UserRegisterDto } from '../dto/auth.dto'
import { isNil, pick } from 'lodash'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from '@userModule/entities/user.entity'
import { AttributeAuthentication } from '@authModule/interfaces/auth.interface'
import { OAuth2Client } from 'google-auth-library'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService extends BaseService {
  private authenticatedUserFields = ['id', 'email']
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    super()
  }

  /**
   * Generate token
   * @param params Partial UserEntity
   * @returns AttributeAuthentication
   */
  private _generateToken(params: Partial<UserEntity>): AttributeAuthentication {
    const token = this.jwtService.sign(params)
    return {
      token,
      expiresIn: process.env.JWT_TTL,
    }
  }

  /**
   * Register native user
   * @param params UserRegisterDto
   * @returns AttributeAuthentication
   */
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

  /**
   * Login native user
   * @param params UserLoginDto
   * @returns AttributeAuthentication
   */
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

  /**
   * Login via google
   * @param params UserLoginDto
   * @returns AttributeAuthentication
   */
  async googleLogin(params: LoginGoogleDto) {
    const { idToken } = params
    const client = new OAuth2Client(this.config.get('GOOGLE_CONSUMER_KEY'))

    let ticket

    try {
      ticket = await client.verifyIdToken({
        idToken,
      })
    } catch (e) {
      throw new BadRequestException('Token is not valid')
    }

    const payload = ticket.getPayload()

    if (!payload) {
      throw new BadRequestException('Can not parser idToken')
    }

    const { email, givenName, familyName } = payload

    if (isNil(email) || email === '') {
      throw new BadRequestException('Can not get email address')
    }

    const user = await this.userService.firstOrCreate(
      { where: email },
      {
        email: this.userService.sanitizeEmail(email),
        firstName: familyName,
        lastName: givenName,
      },
    )

    const partialUserProperties: Partial<UserEntity> = pick(
      user,
      this.authenticatedUserFields,
    )

    return this._generateToken(partialUserProperties)
  }
}
