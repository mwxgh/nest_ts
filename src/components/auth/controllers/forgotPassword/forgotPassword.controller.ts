import {
  ResetPasswordDto,
  SendResetLinkDto,
} from '@authModule/dto/forgotPassword.dto'
import { SendResetLinkNotification } from '@authModule/notifications/sendResetLink.notification'
import { PasswordResetService } from '@authModule/services/passwordReset.service'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  GetItemResponse,
  SuccessfullyOperation,
} from '@sharedServices/apiResponse/apiResponse.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserService } from '@userModule/services/user.service'
import { UserTransformer } from '@userModule/transformers/user.transformer'

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class ForgotPasswordController {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private passwordResetService: PasswordResetService,
    private configService: ConfigService,
    private response: ApiResponseService,
  ) {}

  @Post('forgotPassword')
  @ApiOperation({ summary: 'Send reset password link to email' })
  @ApiOkResponse({ description: 'Reset password link sent success' })
  async sendResetLinkEmail(
    @Body() data: SendResetLinkDto,
  ): Promise<SuccessfullyOperation> {
    const { email } = data

    const user = await this.userService.firstOrFail({
      where: { email: this.userService.sanitize(email) },
    })

    await this.passwordResetService.expireAllToken(user.email)

    const password_reset = await this.passwordResetService.generate(user.email)

    await this.notificationService.send(
      user,
      new SendResetLinkNotification(
        password_reset,
        this.configService.get('FRONTEND_URL'),
      ),
    )

    return this.response.success()
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ description: 'Reset password successfully' })
  @ApiBadRequestResponse({ description: 'Token is expired' })
  async resetPassword(
    @Body() data: ResetPasswordDto,
  ): Promise<GetItemResponse> {
    const { token, password } = data

    const passwordReset = await this.passwordResetService.firstOrFail({
      where: { token },
    })

    if (this.passwordResetService.isExpired(passwordReset)) {
      throw new BadRequestException('Token is expired')
    }

    await this.passwordResetService.expire(token)

    const user: UserEntity = await this.userService.first({
      where: { email: passwordReset.email },
    })

    await this.userService.changePassword(user.id, password)

    return this.response.item(user, new UserTransformer())
  }
}
