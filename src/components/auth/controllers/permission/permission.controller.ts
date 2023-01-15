import { Auth } from '@authModule/decorators/auth.decorator'
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@authModule/dto/permission.dto'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { PermissionService } from '@authModule/services/permission.service'
import { PermissionTransformer } from '@authModule/transformers/permission.transformer'
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
import { PrimitiveService } from '@shared/services/primitive.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { assign } from 'lodash'

@ApiTags('Permissions')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/permissions')
export class PermissionController {
  constructor(
    private response: ApiResponseService,
    private permissionService: PermissionService,
    private primitiveService: PrimitiveService,
  ) {}

  private entity = 'permission'
  private fields = ['name']

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new permission' })
  @ApiOkResponse({ description: 'New permission entity' })
  async createPermission(
    @Body() data: CreatePermissionDto,
  ): Promise<CreateResponse> {
    const slug = await this.permissionService.generateSlug(data.name)

    const permission = await this.permissionService.create(
      assign(data, { slug: slug }),
    )

    return this.response.item(permission, new PermissionTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list permissions' })
  @ApiOkResponse({ description: 'List permissions with query param' })
  async readPermissions(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, sortBy, sortType } = query

    const queryBuilder = await this.permissionService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }
      const permissions = await this.permissionService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(permissions, new PermissionTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new PermissionTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get permission by id' })
  @ApiOkResponse({ description: 'Permission entity' })
  async readPermission(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const permission = await this.permissionService.findOneOrFail(id)

    return this.response.item(permission, new PermissionTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update permission by id' })
  @ApiOkResponse({ description: 'Update permission entity' })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<UpdateResponse> {
    await this.permissionService.findOneOrFail(id)

    const slug = await this.permissionService.generateSlug(data.name)

    const permission = await this.permissionService.update(
      id,
      assign(data, { slug: slug }),
    )

    return this.response.item(permission, new PermissionTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete permission by id' })
  @ApiOkResponse({ description: 'Delete permission successfully' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.permissionService.findOneOrFail(id)

    await this.permissionService.destroy(id)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
