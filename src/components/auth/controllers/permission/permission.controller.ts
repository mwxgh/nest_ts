import { Auth } from '@authModule/decorators/auth.decorator'
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@authModule/dto/permission.dto'
import { PermissionEntity } from '@authModule/entities/permission.entity'
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
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { assign } from 'lodash'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'

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
  ) {}

  private entity = 'permission'
  private fields = ['name']

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.permission.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.permission.create.apiOk })
  async savePermission(
    @Body() data: CreatePermissionDto,
  ): Promise<CreateResponse> {
    const permission = await this.permissionService.create(
      assign(data, {
        slug: await this.permissionService.generateSlug(data.name),
      }),
    )

    return this.response.item(permission, new PermissionTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.permission.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.permission.read.apiOk })
  async readPermissions(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<PermissionEntity>, string[]] =
      await this.permissionService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.permissionService.paginationCalculate(
          queryBuilder,
          paginateOption,
        ),
        new PermissionTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new PermissionTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.permission.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.permission.detail.apiOk })
  async readPermission(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const permission: PermissionEntity =
      await this.permissionService.findOneOrFail(id)

    return this.response.item(permission, new PermissionTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.permission.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.permission.update.apiOk })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<UpdateResponse> {
    const permission = await this.permissionService.updatePermission({
      id,
      data,
    })

    return this.response.item(permission, new PermissionTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.permission.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.permission.delete.apiOk })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.permissionService.deletePermission(id)

    return this.response.success({
      message: this.permissionService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
