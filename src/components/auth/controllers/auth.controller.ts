import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  LoginGoogleDto,
  RefreshDto,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/auth.dto'
import { AuthService } from '@authModule/services/auth.service'
import { AttributeAuthentication } from '@authModule/interfaces/auth.interface'

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('loginGoogle')
  @ApiOperation({ summary: 'Login with google token' })
  @ApiOkResponse({ description: 'Token for access system' })
  async googleAuthCallback(
    @Body() data: LoginGoogleDto,
  ): Promise<AttributeAuthentication> {
    return this.authService.googleLogin(data)
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user with email' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userRegister(
    @Body() data: UserRegisterDto,
  ): Promise<AttributeAuthentication> {
    // check user exist
    return this.authService.register(data)
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userLogin(@Body() data: UserLoginDto): Promise<any> {
    return this.authService.login(data)
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiOkResponse({ description: 'Token for access system' })
  async refresh(@Body() data: RefreshDto): Promise<any> {
    return this.authService.refresh(data)
  }
}
