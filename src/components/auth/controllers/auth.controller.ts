import { UserService } from '../../user/services/user.service';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { JwtService } from '@nestjs/jwt';
import { pick, isNil } from 'lodash';
import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginDto, UserRegisterDto, LoginGoogleDto } from '../dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

const authenticatedUserFields = ['id', 'email'];
@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @Post('loginGoogle')
  async googleAuthCallback(@Body() body: LoginGoogleDto): Promise<any> {
    const client = new OAuth2Client(this.config.get('GOOGLE_CONSUMER_KEY'));
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: body.idToken,
      });
    } catch (e) {
      throw new BadRequestException('Token is not valid');
    }
    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestException('Can not parser idToken');
    }
    const email: string = payload.email;
    if (isNil(email) || email === '') {
      throw new BadRequestException('Can not get email address');
    }
    let user = await this.userService.first({ where: { email } });
    if (!user) {
      user = await this.userService.create({
        email: this.userService.sanitizeEmail(email),
        first_name: payload.given_name,
        last_name: payload.family_name,
      });
    }
    return this.response.object({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    });
  }

  @Post('/register')
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse({ description: 'Email already exist' })
  async register(
    @Body() data: UserRegisterDto,
  ): Promise<{ [key: string]: any }> {
    const { email, password } = data;
    if (await this.userService.isExisting(email)) {
      throw new ConflictException('Email already exist');
    }
    const user = await this.userService.create({
      ...pick(data, ['email', 'password', 'firstName', 'lastName']),
      ...{
        password: this.userService.hashPassword(password),
        email: this.userService.sanitizeEmail(email),
      },
    });
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    });
  }

  @Post('/login')
  @ApiResponse({ status: 201, description: 'Authenticated' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async login(@Body() data: UserLoginDto): Promise<{ [key: string]: any }> {
    const { email, password } = data;
    const user = await this.userService.first({
      where: {
        email: this.userService.sanitizeEmail(email),
      },
      select: [...authenticatedUserFields, 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = this.userService.checkPassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Password does not match');
    }
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    });
  }
}
