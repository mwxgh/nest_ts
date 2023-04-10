import {
  ResetPasswordDto,
  SendResetLinkDto,
} from '@authModule/dto/forgotPassword.dto'
import { SendResetLinkNotification } from '@authModule/notifications/sendResetLink.notification'
import { PasswordResetService } from '@authModule/services/passwordReset.service'
import { Body, Controller, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  ResponseEntity,
  SuccessfullyOperation,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { UserTransformer } from '@userModule/transformers/user.transformer'
import { APIDoc } from 'src/components/components.apidoc'

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class ForgotPasswordController {
  constructor(
    private notificationService: NotificationService,
    private passwordResetService: PasswordResetService,
    private configService: ConfigService,
    private response: ApiResponseService,
  ) {}

  @Post('forgotPassword')
  @ApiOperation({ summary: APIDoc.auth.forgotPassword.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.forgotPassword.apiOk })
  async sendResetLinkEmail(
    @Body() data: SendResetLinkDto,
  ): Promise<SuccessfullyOperation> {
    const [user, passwordReset] =
      await this.passwordResetService.requestResetPassword(data)

    await this.notificationService.send(
      user,
      new SendResetLinkNotification(
        passwordReset,
        this.configService.get('FRONTEND_URL'),
      ),
    )

    return this.response.success({
      message: this.passwordResetService.getMessage({
        message: Messages.successfullyOperation.sent,
        keywords: ['request reset password'],
      }),
    })
  }

  @Post('resetPassword')
  @ApiOperation({ summary: APIDoc.auth.resetPassword.apiOperation })
  @ApiOkResponse({ description: APIDoc.auth.resetPassword.apiOk })
  @ApiBadRequestResponse({
    description: APIDoc.auth.resetPassword.apiBadRequest,
  })
  async resetPassword(@Body() data: ResetPasswordDto): Promise<ResponseEntity> {
    const user = await this.passwordResetService.resetPassword(data)

    return this.response.item(user, new UserTransformer())
  }
}
