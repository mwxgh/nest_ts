import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { UserService } from '@userModule/services/user.service'
import { OAuth2Client } from 'google-auth-library'
import { isNil, pick } from 'lodash'
import { LoginGoogleDto, UserLoginDto, UserRegisterDto } from '../dto/auth.dto'
import { AuthService } from '@authModule/services/auth.service'
import { AttributeAuthentication } from '@authModule/interfaces/auth.interface'

const authenticatedUserFields = ['id', 'email']
@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private authService: AuthService,
  ) {}

  @Post('loginGoogle')
  @ApiOperation({ summary: 'Login with google token' })
  @ApiOkResponse({ description: 'Token for access system' })
  async googleAuthCallback(
    @Body() body: LoginGoogleDto,
  ): Promise<AttributeAuthentication> {
    const client = new OAuth2Client(this.config.get('GOOGLE_CONSUMER_KEY'))

    let ticket

    try {
      ticket = await client.verifyIdToken({
        idToken: body.idToken,
      })
    } catch (e) {
      throw new BadRequestException('Token is not valid')
    }

    const payload = ticket.getPayload()

    if (!payload) {
      throw new BadRequestException('Can not parser idToken')
    }

    const email: string = payload.email

    if (isNil(email) || email === '') {
      throw new BadRequestException('Can not get email address')
    }

    let user = await this.userService.first({ where: { email } })

    if (!user) {
      user = await this.userService.create({
        email: this.userService.sanitizeEmail(email),
        firstName: payload.givenName,
        lastName: payload.familyName,
      })
    }

    const resource = {
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
      expiresIn: process.env.JWT_TTL,
    }

    return resource
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user with email' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userRegister(
    @Body() data: UserRegisterDto,
  ): Promise<AttributeAuthentication> {
    // check user exist
    return await this.authService.register(data)
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userLogin(@Body() data: UserLoginDto): Promise<any> {
    return this.authService.login(data)
  }
}
