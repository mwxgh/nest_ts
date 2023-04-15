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
import { Request } from 'express'
import { APIDoc } from 'src/components/components.apidoc'
import {
  LoginGoogleDto,
  RefreshDto,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/auth.dto'

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private response: ApiResponseService,
  ) {}

  @Post('loginGoogle')
  @ApiOperation({ summary: APIDoc.auth.loginGoogle.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.loginGoogle.apiOk })
  async googleAuthCallback(
    @Body() data: LoginGoogleDto,
  ): Promise<AuthenticationAttribute> {
    return this.auth.googleLogin(data)
  }

  @Post('register')
  @ApiOperation({ summary: APIDoc.auth.register.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.register.apiOk })
  async userRegister(
    @Body() data: UserRegisterDto,
  ): Promise<AuthenticationAttribute> {
    return this.auth.register(data)
  }

  @Post('login')
  @ApiOperation({ summary: APIDoc.auth.login.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.login.apiOk })
  async userLogin(
    @Body() data: UserLoginDto,
  ): Promise<AuthenticationAttribute> {
    return this.auth.login(data)
  }

  @Post('refresh')
  @ApiOperation({ summary: APIDoc.auth.refresh.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.refresh.apiOk })
  async refresh(@Body() data: RefreshDto): Promise<AuthenticationAttribute> {
    return this.auth.refresh(data)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  @ApiOperation({ summary: APIDoc.auth.logout.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.logout.apiOk })
  async logout(
    @Req() request: Request,
    @AuthenticatedUser() currentUser: Me,
  ): Promise<SuccessfullyOperation> {
    await this.auth.logout(currentUser)

    return this.response.success({
      message: this.auth.getMessage({
        message: Messages.successfullyOperation.logout,
      }),
    })
  }
}
