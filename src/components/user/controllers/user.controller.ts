import { Auth } from '@authModule/decorators/auth.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { SendInviteUserLinkNotification } from '@authModule/notifications/sendInviteUserLink.notification'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
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
import Messages from '@shared/message/message'
import {
  CreateResponse,
  GetListPaginationResponse,
  GetListResponseWithoutDataObj,
  SuccessfullyOperation,
  UpdateResponse,
} from '@sharedServices/apiResponse/apiResponse.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { CommonService } from '@sharedServices/common.service'
import { NotificationService } from '@sharedServices/notification/notification.service'
import { IPaginationOptions } from '@sharedServices/pagination'
import { Request } from 'express'
import { isBoolean, isNil, pick } from 'lodash'
import { SelectQueryBuilder } from 'typeorm'
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UserAttachRoleDto,
  UserDetachRoleDto,
  UserSendMailReportDto,
} from '../dto/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserPasswordChangedNotification } from '../notifications/userPasswordChanged.notification'
import { UserSendMailReportNotification } from '../notifications/userSendEmailReport.notification'
import { VerifyUserNotification } from '../notifications/verifyUser.notification'
import { InviteUserService } from '../services/inviteUser.service'
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
    private userService: UserService,
    private response: ApiResponseService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private inviteUserService: InviteUserService,
    private commonService: CommonService,
  ) {}

  private entity = 'use'
  private fields = ['email', 'username', 'firstName', 'lastName']
  private relations = ['roles']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create user' })
  @ApiOkResponse({ description: 'New user entity' })
  async createUser(@Body() data: CreateUserDto): Promise<CreateResponse> {
    const saveUser = await this.userService.saveUser({
      data,
    })

    return this.response.itemWithoutDataObj(
      saveUser,
      new UserTransformer(this.relations),
    )
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list users' })
  @ApiOkResponse({ description: 'List users with query params' })
  async readUsers(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponseWithoutDataObj | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    let queryBuilder: SelectQueryBuilder<UserEntity> =
      await this.userService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        sortBy,
        sortType,
      })

    let joinAndSelects = []

    if (!isNil(includes)) {
      const includesParams = Array.isArray(includes) ? includes : [includes]

      joinAndSelects = this.commonService.includesParamToJoinAndSelects({
        includesParams,
        relations: this.relations,
      })

      if (joinAndSelects.length > 0) {
        joinAndSelects.forEach((joinAndSelect) => {
          queryBuilder = queryBuilder.leftJoinAndSelect(
            `${this.entity}.${joinAndSelect}`,
            `${joinAndSelect}`,
          )
        })
      }
    }
    const relationTransformer =
      joinAndSelects.length > 0 ? joinAndSelects : undefined

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.userService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(
        data,
        new UserTransformer(relationTransformer),
      )
    }

    const users = await queryBuilder.getMany()

    return this.response.collectionWithoutDataObj(
      users,
      new UserTransformer(relationTransformer),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get user by id' })
  @ApiOkResponse({ description: 'User entity' })
  async readUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const user = await this.userService.findOneOrFail(id, {
      relations: ['roles'],
    })

    return this.response.itemWithoutDataObj(
      user,
      new UserTransformer(this.relations),
    )
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update user by id' })
  @ApiOkResponse({ description: 'Update user entity' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UpdateResponse> {
    const updateUser = await this.userService.updateUser({ id, data })

    if (isBoolean(data.notifyUser) && data.notifyUser === true) {
      this.notificationService.send(
        updateUser,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.itemWithoutDataObj(
      updateUser,
      new UserTransformer(this.relations),
    )
  }

  @Put(':id/password')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin change password for user by id' })
  @ApiOkResponse({ description: 'Update password user entity' })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ): Promise<SuccessfullyOperation> {
    const user = await this.userService.findOneOrFail(id)

    await this.userService.update(user.id, {
      password: this.userService.hash(data.password),
    })

    if (isBoolean(data.notifyUser) && data.notifyUser === true) {
      this.notificationService.send(
        user,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.updatePassword,
        keywords: ['password', 'user'],
      }),
    })
  }

  @Post(':id/sendVerifyLink')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin send verify link for user by id' })
  @ApiOkResponse({ description: 'Send mail successfully' })
  async sendVerifyLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const user = await this.userService.findOneOrFail(id)

    await this.userService.generateVerifyToken(user.id)

    this.notificationService.send(
      user,
      new VerifyUserNotification(
        user.generateVerifyEmailLink(this.configService.get('FRONTEND_URL')),
      ),
    )

    return this.response.success()
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify token' })
  @ApiOkResponse({ description: 'User verified successfully' })
  async verify(@Query('token') token: string): Promise<any> {
    const user: UserEntity = await this.userService.firstOrFail({
      where: { verifyToken: token, verified: false, verifiedAt: null },
    })

    const result = await this.userService.verify(user.id)

    return this.response.item(result, new UserTransformer())
  }

  @Post('invite')
  @Auth('admin')
  @ApiOperation({ summary: 'Invite new user using system' })
  @ApiOkResponse({ description: 'Mail notification user' })
  async inviteUser(@Req() request: Request): Promise<SuccessfullyOperation> {
    const data = (request as any).body

    const check = await this.userService.emailExist(data.email)

    if (check) {
      throw new BadRequestException('User is exist in system')
    }

    const item = await this.userService.create(pick(data, ['email']))

    await this.inviteUserService.expireAllToken(item.email)

    const passwordReset = await this.inviteUserService.generate(item.email)

    await this.notificationService.send(
      item,
      new SendInviteUserLinkNotification(
        passwordReset,
        this.configService.get('FRONTEND_URL'),
      ),
    )

    return this.response.success()
  }

  @Post(':id/attachRole')
  @Auth('admin')
  @ApiOperation({ summary: 'Attach user and role' })
  @ApiOkResponse({ description: 'Attach role successfully' })
  async attachRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserAttachRoleDto,
  ): Promise<SuccessfullyOperation> {
    await this.userService.attachRole({ userId: id, roleId: data.roleId })

    return this.response.success()
  }

  @Post(':id/detachRole')
  @Auth('admin')
  @ApiOperation({ summary: 'Detach user and role' })
  @ApiOkResponse({ description: 'Detach role successfully' })
  async detachRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserDetachRoleDto,
  ): Promise<SuccessfullyOperation> {
    await this.userService.detachRole({ userId: id, roleId: data.roleId })

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
    const user = await this.userService.findOneOrFail(id)

    this.notificationService.send(
      user,
      new UserSendMailReportNotification(data.toEmail, data.linkReport),
    )

    return this.response.success()
  }
}
