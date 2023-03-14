import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { AuthenticationAttribute } from '@authModule/interfaces/auth.interface'
import { AuthService } from '@authModule/services/auth.service'
import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { SuccessfullyOperation } from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { ApiResponseService } from '@shared/services/apiResponse/apiResponse.service'
import { Me } from '@userModule/dto/user.dto'
import {
  LoginGoogleDto,
  RefreshDto,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/auth.dto'
import { Request } from 'express'

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private response: ApiResponseService,
  ) {}

  @Post('loginGoogle')
  @ApiOperation({ summary: 'Login with google token' })
  @ApiOkResponse({ description: 'Token for access system' })
  async googleAuthCallback(
    @Body() data: LoginGoogleDto,
  ): Promise<AuthenticationAttribute> {
    return this.authService.googleLogin(data)
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user with email' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userRegister(
    @Body() data: UserRegisterDto,
  ): Promise<AuthenticationAttribute> {
    return this.authService.register(data)
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userLogin(
    @Body() data: UserLoginDto,
  ): Promise<AuthenticationAttribute> {
    return this.authService.login(data)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh login with refresh' })
  @ApiOkResponse({ description: 'Token for access system' })
  async refresh(@Body() data: RefreshDto): Promise<AuthenticationAttribute> {
    return this.authService.refresh(data)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Logout successfully' })
  async logout(
    @Req() request: Request,
    @AuthenticatedUser() currentUser: Me,
  ): Promise<SuccessfullyOperation> {
    await this.authService.logout({ currentUser })

    return this.response.success({
      message: this.authService.getMessage({
        message: Messages.successfullyOperation.logout,
      }),
    })
  }
}
