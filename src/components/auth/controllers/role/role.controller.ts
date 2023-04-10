import { Auth } from '@authModule/decorators/auth.decorator'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { RoleEntity } from '@authModule/entities/role.entity'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { RoleService } from '@authModule/services/role.service'
import { RoleTransformer } from '@authModule/transformers/role.transformer'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
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
import Messages from '@shared/message/message'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { Me } from '@userModule/dto/user.dto'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'

@ApiTags('Roles')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/roles')
export class RoleController {
  constructor(
    private response: ApiResponseService,
    private roleService: RoleService,
  ) {}

  private entity = 'role'
  private fields = ['name', 'level']
  private relations = ['permissions']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.role.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.role.create.apiOk })
  async createRole(@Body() data: CreateRoleDto): Promise<CreateResponse> {
    const role = await this.roleService.createRole(data)

    return this.response.item(role, new RoleTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.role.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.role.read.apiOk })
  async readRoles(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder, includesParams]: [
      SelectQueryBuilder<RoleEntity>,
      string[],
    ] = await this.roleService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      relations: this.relations,
      ...query,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.roleService.paginationCalculate(
          queryBuilder,
          paginateOption,
        ),
        new RoleTransformer(includesParams),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new RoleTransformer(includesParams),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.role.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.role.detail.apiOk })
  async readRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const role: RoleEntity = await this.roleService.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(role, new RoleTransformer(this.relations))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.role.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.role.update.apiOk })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ): Promise<UpdateResponse> {
    const role = await this.roleService.updateRole({ id, data })

    return this.response.item(role, new RoleTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.role.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.role.delete.apiOk })
  async deleteRole(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.roleService.deleteRole({ id, currentUser })

    return this.response.success({
      message: this.roleService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
