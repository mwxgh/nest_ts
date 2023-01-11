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
import { GetItemResponseNotObject } from '@sharedServices/apiResponse/apiResponse.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { Me } from '@userModule/dto/user.dto'
import { UserService } from '@userModule/services/user.service'
import { UserTransformer } from '@userModule/transformers/user.transformer'
import { UpdatePasswordDto, UpdateProfileDto } from '../dto/updateProfile.dto'
import { identity, pickBy } from 'lodash'

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

  private relations = ['roles']

  @Get()
  @ApiOperation({ summary: 'Get profile current user' })
  @ApiOkResponse({ description: 'Profile current user' })
  async profile(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetItemResponseNotObject> {
    return this.response.itemWithoutDataObj(
      currentUser,
      new UserTransformer(this.relations),
    )
  }

  @Put()
  @ApiOperation({ summary: 'Update profile current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async updateProfile(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdateProfileDto,
  ): Promise<GetItemResponseNotObject> {
    const data: UpdateProfileDto = {
      username: body.username ? body.username : null,
      firstName: body.firstName ? body.firstName : null,
      lastName: body.lastName ? body.lastName : null,
    }

    const existingData = pickBy(data, identity)

    const user = await this.userService.update(currentUser.id, existingData)
    // create updateProfile to transformer with relations
    return this.response.itemWithoutDataObj(user, new UserTransformer())
  }

  @Put('password')
  @ApiOperation({ summary: 'Update password current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async changePassword(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdatePasswordDto,
  ): Promise<GetItemResponseNotObject> {
    const { password, oldPassword } = body

    if (!this.hashService.compare(oldPassword, currentUser.password)) {
      throw new BadRequestException('Old password is not correct')
    }

    const user = await this.userService.update(currentUser.id, {
      password: this.hashService.hash(password),
    })

    // create updateProfile to transformer with relations
    return this.response.itemWithoutDataObj(user, new UserTransformer())
  }
}
