import { Auth } from '@authModule/decorators/auth.decorator'
import { PasswordResetEntity } from '@authModule/entities/passwordReset.entity'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { SendInviteUserLinkNotification } from '@authModule/notifications/sendInviteUserLink.notification'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import {
  CreateResponse,
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
  UpdateResponse,
} from '@shared/interfaces/response.interface'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { isNil } from 'lodash'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'
import {
  CreateUserDto,
  InviteUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UserSendMailReportDto,
} from '../dto/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserPasswordChangedNotification } from '../notifications/userPasswordChanged.notification'
import { UserSendMailReportNotification } from '../notifications/userSendEmailReport.notification'
import { VerifyUserNotification } from '../notifications/verifyUser.notification'
import { UserService } from '../services/user.service'
import { UserTransformer } from '../transformers/user.transformer'

@ApiTags('Users')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private user: UserService,
    private response: ApiResponseService,
    private notification: NotificationService,
    private config: ConfigService,
  ) {}

  private entity = 'use'
  private fields = ['email', 'username', 'firstName', 'lastName']
  private relations = ['roles']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.user.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.user.create.apiOk })
  async createUser(@Body() data: CreateUserDto): Promise<CreateResponse> {
    const saveUser = await this.user.saveUser(data)

    return this.response.item(saveUser, new UserTransformer(this.relations))
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.user.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.user.read.apiOk })
  async readUsers(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder, includesParams]: [
      SelectQueryBuilder<UserEntity>,
      string[],
    ] = await this.user.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      relations: this.relations,
      ...query,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.user.paginationCalculate(queryBuilder, paginateOption),
        new UserTransformer(includesParams),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new UserTransformer(includesParams),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.user.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.user.detail.apiOk })
  async readUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const user = await this.user.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(user, new UserTransformer(this.relations))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.user.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.user.update.apiOk })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UpdateResponse> {
    const user: UserEntity = await this.user.updateUser({ id, data })

    if (isNil(data.notifyUser) && data.notifyUser === true) {
      this.notification.send(
        user,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.item(user, new UserTransformer())
  }

  @Put(':id/password')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.user.updatePassword.apiOperation })
  @ApiOkResponse({ description: APIDoc.user.updatePassword.apiOk })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ): Promise<UpdateResponse> {
    await this.user.checkExisting({ where: { id } })

    const user: UserEntity = await this.user.update(id, {
      password: this.user.hashPassword(data.password),
    })

    if (isNil(data.notifyUser) && data.notifyUser === true) {
      this.notification.send(
        user,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.item(user, new UserTransformer())
  }

  @Post(':id/sendVerifyLink')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin send verify link for user by id' })
  @ApiOkResponse({ description: 'Send mail successfully' })
  async sendVerifyLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const user: UserEntity = await this.user.findOneOrFail(id)

    await this.user.generateVerifyToken(user.id)

    this.notification.send(
      user,
      new VerifyUserNotification(
        user.generateVerifyEmailLink(this.config.get('FRONTEND_URL')),
      ),
    )

    return this.response.success()
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify token' })
  @ApiOkResponse({ description: 'User verified successfully' })
  async verify(@Query('token') token: string): Promise<UpdateResponse> {
    const user: UserEntity = await this.user.firstOrFail({
      where: { verifyToken: token, verified: false, verifiedAt: null },
    })

    const result = await this.user.verify(user.id)

    return this.response.item(result, new UserTransformer())
  }

  @Post('invite')
  @Auth('admin')
  @ApiOperation({ summary: 'Invite new user using system' })
  @ApiOkResponse({ description: 'Mail notification user' })
  async inviteUser(
    @Body() data: InviteUserDto,
  ): Promise<SuccessfullyOperation> {
    const [user, passwordReset]: [UserEntity, PasswordResetEntity] =
      await this.user.inviteUser(data)
    await this.notification.send(
      user,
      new SendInviteUserLinkNotification(
        passwordReset,
        this.config.get('FRONTEND_URL'),
      ),
    )

    return this.response.success()
  }

  @Post(':id/sendMail')
  @Auth('admin')
  @ApiOperation({ summary: 'Send mail report user' })
  @ApiOkResponse({ description: 'Send mail successfully' })
  async sendMail(
    @Body() data: UserSendMailReportDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const user = await this.user.findOneOrFail(id)

    this.notification.send(
      user,
      new UserSendMailReportNotification(data.toEmail, data.linkReport),
    )

    return this.response.success()
  }
}
