import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { UserService } from '../../user/services/user.service';
import { UserTransformer } from '../../user/transformers/user.transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HashService } from '../../../shared/services/hash/hash.service';
import {
  UpdateProfileParams,
  UpdatePasswordParams,
} from '../dto/updateProfile.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(
    private response: ApiResponseService,
    private userService: UserService,
    private hashService: HashService,
  ) {}

  @Get()
  async profile(@Req() request: Request): Promise<any> {
    const userId = (request as any).user.id;
    const user = await this.userService.find(userId, { relations: ['roles'] });
    return this.response.item(user, new UserTransformer(['roles']));
  }

  @Put()
  async updateProfile(
    @Req() request: Request,
    @Body() body: UpdateProfileParams,
  ): Promise<any> {
    const id = (request as any).user.id;
    const data: any = {};
    if (body.username) {
      data.username = body.username;
    }
    if (body.firstName) {
      data.firstName = body.firstName;
    }
    if (body.lastName) {
      data.lastName = body.lastName;
    }
    const user = await this.userService.update(id, data);
    return this.response.item(user, new UserTransformer());
  }

  @Put('password')
  async changePassword(
    @Req() request: Request,
    @Body() body: UpdatePasswordParams,
  ): Promise<any> {
    const user = (request as any).user;
    const { password, oldPassword } = body;
    if (!this.hashService.check(oldPassword, user.password)) {
      throw new BadRequestException('Old password is not correct');
    }
    const hashed = this.hashService.hash(password);
    const result = await this.userService.update(user.id, { password: hashed });
    return this.response.item(result, new UserTransformer());
  }
}
