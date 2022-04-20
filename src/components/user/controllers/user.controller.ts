import { UserService } from '../services/user.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  Put,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service';
import { UserTransformer } from '../transformers/user.transformer';
import { isNil, includes, pick, isBoolean } from 'lodash';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { Auth } from '../../auth/decorators/auth.decorator';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { VerifyUserNotification } from '../notifications/verifyUser.notification';
import { UserPasswordChangedNotification } from '../notifications/userPasswordChanged.notification';
import { InviteUserService } from '../services/inviteUser.service';
import { SendInviteUserLinkNotification } from '../../auth/notifications/sendInviteUserLink.notification';
import { QueryPaginateDto } from '../../../shared/dto/findManyParams.dto';
import { Request } from 'express';
import { UserSendMailReportNotification } from '../notifications/userSendEmailReport.notification';
import { AuthenticatedUser } from '../../auth/decorators/authenticatedUser.decorator';
import { User } from '../entities/user.entity';
import { map, isEmpty } from 'lodash';
import { ApiTags } from '@nestjs/swagger';

import { UserSendMailReportDto } from '../dto/user.dto';
import { AdminCreateUserDto, AdminUpdateUserDto } from '../dto/user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private inviteUserService: InviteUserService,
  ) {}

  private entity = 'users';

  private fields = ['email', 'username', 'firstName', 'lastName'];

  @Get('listPaginate')
  @Auth('admin', 'user')
  async index(
    @AuthenticatedUser() user: User,
    @Query() query: { perPage: number; page: number; includes?: string },
    @Query() request: QueryPaginateDto,
  ): Promise<any> {
    let relations = [];

    const params: IPaginationOptions = {
      limit: query.perPage ? query.perPage : 10,
      page: query.page ? query.page : 1,
    };

    const keyword = request.search;

    let baseQuery = await this.userService.queryBuilder(
      this.entity,
      this.fields,
      keyword,
    );

    const userRoles = map(user.roles, (r) => r.slug);

    if (includes(userRoles, 'user') || isEmpty(userRoles)) {
      baseQuery = baseQuery.where('user.id = :id', { id: user.id });
    }

    if (!isNil(query.includes) && query.includes !== '') {
      relations = query.includes.split(',');
      if (includes(relations, 'roles')) {
        baseQuery = baseQuery.leftJoinAndSelect('user.roles', 'role');
      }
    }

    const data = await this.userService.paginate(baseQuery, params);

    return this.response.paginate(data, new UserTransformer(relations));
  }

  @Get(':id')
  @Auth('admin', 'user')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const item = await this.userService.find(id, { relations: ['roles'] });

    return this.response.item(item, new UserTransformer(['roles']));
  }

  @Post()
  @Auth('admin')
  async store(@Body() data: AdminCreateUserDto): Promise<any> {
    const item = await this.userService.create(
      pick(data, ['email', 'username', 'password', 'firstName', 'lastName']),
    );

    return this.response.item(item, new UserTransformer());
  }

  @Put(':id/password')
  @Auth('admin')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AdminUpdateUserDto,
  ): Promise<any> {
    const user = await this.userService.findOrFail(id);

    await this.userService.update(user.id, {
      password: this.userService.hashPassword(data.password),
    });

    if (isBoolean(data.notifyUser) && data.notifyUser === true) {
      this.notificationService.send(
        user,
        new UserPasswordChangedNotification(data.password),
      );
    }

    return this.response.success();
  }

  @Post(':id/sendVerifyLink')
  @Auth('admin')
  async sendVerifyLink(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const user = await this.userService.findOrFail(id);

    await this.userService.generateVerifyToken(user.id);

    this.notificationService.send(
      user,
      new VerifyUserNotification(
        user.generateVerifyEmailLink(this.configService.get('FRONTEND_URL')),
      ),
    );

    return this.response.success();
  }

  @Post(':id/verify')
  async verify(@Query('token') token: string): Promise<any> {
    const user = await this.userService.firstOrFail({
      where: { verifyToken: token, verified: false, verifiedAt: null },
    });

    const result = await this.userService.verify(user.id);

    return this.response.item(result, new UserTransformer());
  }

  @Post('invite')
  @Auth('admin')
  async inviteUser(@Req() request: Request): Promise<any> {
    const data = (request as any).body;

    const check = await this.userService.emailExist(data.email);

    if (check) {
      throw new BadRequestException('User is exist in system');
    }

    const item = await this.userService.create(pick(data, ['email']));

    await this.inviteUserService.expireAllToken(item.email);

    const password_reset = await this.inviteUserService.generate(item.email);

    await this.notificationService.send(
      item,
      new SendInviteUserLinkNotification(
        password_reset,
        this.configService.get('FRONTEND_URL'),
      ),
    );

    return this.response.success();
  }

  @Post(':id/attachRole')
  @Auth('admin')
  async attachRole(@Req() request: Request): Promise<any> {
    const userId = (request as any).params.id;

    const roleId = (request as any).body.roleId;

    await this.userService.attachRole(userId, roleId);

    return this.response.success();
  }

  @Post(':id/detachRole')
  @Auth('admin')
  async detachRole(@Req() request: Request): Promise<any> {
    const userId = (request as any).params.id;

    const roleId = (request as any).body.roleId;

    await this.userService.detachRole(userId, roleId);

    return this.response.success();
  }

  @Post(':id/sendMail')
  @Auth('admin')
  async sendMail(
    @Body() data: UserSendMailReportDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const user = await this.userService.findOrFail(id);

    this.notificationService.send(
      user,
      new UserSendMailReportNotification(data.toEmail, data.linkReport),
    );

    return this.response.success();
  }
}
