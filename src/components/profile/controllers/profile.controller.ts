import {
  Controller,
  Get,
  UseGuards,
  Body,
  Put,
  BadRequestException,
} from '@nestjs/common'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { UserService } from '@userModule/services/user.service'
import { UserTransformer } from '@userModule/transformers/user.transformer'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { HashService } from '@sharedServices/hash/hash.service'
import { UpdateProfileDto, UpdatePasswordDto } from '../dto/updateProfile.dto'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { GetItemResponse } from '@sharedServices/apiResponse/apiResponse.interface'
import { Me } from '@userModule/dto/user.dto'

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
    private response: ApiResponseService,
    private userService: UserService,
    private hashService: HashService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get profile current user' })
  @ApiOkResponse({ description: 'Profile current user' })
  async profile(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetItemResponse> {
    const user = await this.userService.findOneOrFail(currentUser.id, {
      relations: ['role'],
    })

    return this.response.item(user, new UserTransformer(['roles']))
  }

  @Put()
  @ApiOperation({ summary: 'Update profile current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async updateProfile(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdateProfileDto,
  ): Promise<any> {
    const data: any = {}

    if (body.username) {
      data.username = body.username
    }
    if (body.firstName) {
      data.firstName = body.firstName
    }
    if (body.lastName) {
      data.lastName = body.lastName
    }

    const user = await this.userService.update(currentUser.id, data)

    return this.response.item(user, new UserTransformer())
  }

  @Put('password')
  @ApiOperation({ summary: 'Update password current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async changePassword(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdatePasswordDto,
  ): Promise<any> {
    const { password, oldPassword } = body

    if (!this.hashService.check(oldPassword, currentUser.password)) {
      throw new BadRequestException('Old password is not correct')
    }

    const hashed = this.hashService.hash(password)

    const result = await this.userService.update(currentUser.id, {
      password: hashed,
    })

    return this.response.item(result, new UserTransformer())
  }
}
