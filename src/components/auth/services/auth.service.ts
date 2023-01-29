import { AttributeAuthentication } from '@authModule/interfaces/auth.interface'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { BaseService } from '@shared/services/base.service'
import { HashService } from '@shared/services/hash/hash.service'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserService } from '@userModule/services/user.service'
import { OAuth2Client } from 'google-auth-library'
import { isNil, pick } from 'lodash'
import { LoginGoogleDto, UserLoginDto, UserRegisterDto } from '../dto/auth.dto'

@Injectable()
export class AuthService extends BaseService {
  private authenticatedUserFields = ['id', 'email']
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private hashService: HashService,
  ) {
    super()
  }

  /**
   * Generate token
   *
   * @param params.user UserEntity
   * @param params.refresh refresh flag
   *
   * @returns AttributeAuthentication
   */
  private async _generateToken(params: {
    user: Partial<UserEntity>
    refresh: boolean
  }): Promise<AttributeAuthentication> {
    const { user, refresh } = params

    const partialUserProperties: Partial<UserEntity> = pick(
      user,
      this.authenticatedUserFields,
    )
    const token = this.jwtService.sign(partialUserProperties)

    if (refresh === false) {
      const refreshToken = this.jwtService.sign(partialUserProperties, {
        secret: process.env.APP_REFRESH_KEY,
        expiresIn: process.env.JWT_REFRESH_TTL,
      })

      await this.userService.update(partialUserProperties.id, {
        refreshToken: this.hashService.hash(
          refreshToken.split('').reverse().join(''),
        ),
      })

      return {
        token,
        expiresIn: process.env.JWT_TTL,
        refreshToken,
        expiresRefreshIn: process.env.JWT_REFRESH_TTL,
      }
    } else {
      return {
        token,
        expiresIn: process.env.JWT_TTL,
      }
    }
  }

  /**
   * Register native user
   *
   * @param params UserRegisterDto
   *
   * @returns AttributeAuthentication
   */
  async register(params: UserRegisterDto): Promise<AttributeAuthentication> {
    const user = await this.userService.saveUser({
      data: params,
    })

    return this._generateToken({ user, refresh: false })
  }

  /**
   * Login native user
   *
   * @param params UserLoginDto
   *
   * @returns AttributeAuthentication
   */
  async login(params: UserLoginDto): Promise<AttributeAuthentication> {
    const { email, password } = params

    const user: Partial<UserEntity> = await this.userService.firstOrFail({
      where: {
        email: this.userService.sanitize(email),
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

    return this._generateToken({ user, refresh: false })
  }

  /**
   * Login via google
   *
   * @param params UserLoginDto
   *
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
      { where: { email } },
      {
        email: this.userService.sanitize(email),
        firstName: familyName,
        lastName: givenName,
      },
    )

    return this._generateToken(user)
  }

  /**
   * Get user by refresh token
   *
   * @param params.email
   * @param params.refreshToken
   *
   * @returns UserEntity
   */
  async getUserByRefreshToken(params: {
    email: string
    refreshToken: string
  }): Promise<UserEntity> {
    const { email, refreshToken } = params

    const user: UserEntity = await this.userService.firstOrFail({
      where: { email },
    })

    const isEqual = this.hashService.compare(
      refreshToken.split('').reverse().join(''),
      user.refreshToken,
    )
    if (isEqual == false) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  /**
   * Refresh login with refresh token
   *
   * @param param.refreshToken
   *
   * @returns AttributeAuthentication
   */
  async refresh(param: {
    refreshToken: string
  }): Promise<AttributeAuthentication> {
    const { refreshToken } = param

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.APP_REFRESH_KEY,
      })

      const user: UserEntity = await this.getUserByRefreshToken({
        email: payload.email,
        refreshToken,
      })

      return this._generateToken({ user, refresh: true })
    } catch (error) {
      throw new UnprocessableEntityException('Can not refresh token')
    }
  }

  async logout(user: UserEntity) {
    await this.userService.update(user.id, { refreshToken: null })
  }
}
