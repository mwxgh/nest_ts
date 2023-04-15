import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { GetItemResponse } from '@shared/interfaces/response.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { Me } from '@userModule/dto/user.dto'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserService } from '@userModule/services/user.service'
import { UserTransformer } from '@userModule/transformers/user.transformer'
import { APIDoc } from 'src/components/components.apidoc'
import { UpdatePasswordDto, UpdateProfileDto } from '../dto/updateProfile.dto'

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/profile')
export class ProfileController {
  constructor(
    private user: UserService,
    private hash: HashService,
    private response: ApiResponseService,
  ) {}

  private relations = ['roles']

  @Get()
  @ApiOperation({ summary: APIDoc.profile.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.profile.detail.apiOk })
  async profile(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetItemResponse> {
    return this.response.item(currentUser, new UserTransformer(this.relations))
  }

  @Put()
  @ApiOperation({ summary: APIDoc.profile.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.profile.update.apiOk })
  async updateProfile(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdateProfileDto,
  ): Promise<GetItemResponse> {
    const user: UserEntity = await this.user.update(currentUser.id, body)

    return this.response.item(user, new UserTransformer())
  }

  @Put('password')
  @ApiOperation({ summary: APIDoc.profile.updatePassword.apiOperation })
  @ApiOkResponse({ description: APIDoc.profile.updatePassword.apiOk })
  async changePassword(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdatePasswordDto,
  ): Promise<GetItemResponse> {
    const { password, oldPassword } = body

    if (!this.hash.compare(oldPassword, currentUser.password)) {
      throw new BadRequestException('Old password is not correct')
    }

    const user = await this.user.update(currentUser.id, {
      password: this.hash.hash(password),
    })

    return this.response.item(user, new UserTransformer())
  }
}
