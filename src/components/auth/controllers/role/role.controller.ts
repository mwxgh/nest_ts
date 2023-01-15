import { Auth } from '@authModule/decorators/auth.decorator'
import { CreateRoleDto, UpdateRoleDto } from '@authModule/dto/role.dto'
import { RoleEntity } from '@authModule/entities/role.entity'
import { RolePermissionEntity } from '@authModule/entities/rolePermission.entity'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { RoleService } from '@authModule/services/role.service'
import { RolePermissionService } from '@authModule/services/rolePermission.service'
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
import { PrimitiveService } from '@shared/services/primitive.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { assign, isNil } from 'lodash'
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
    private rolePermissionService: RolePermissionService,
    private primitiveService: PrimitiveService,
  ) {}

  private entity = 'role'
  private fields = ['name', 'level']
  private relations = ['permissions']

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new role' })
  @ApiOkResponse({ description: 'New role entity' })
  async createRole(@Body() data: CreateRoleDto): Promise<CreateResponse> {
    const slug = await this.roleService.generateSlug(data.name)

    const role = await this.roleService.create(assign(data, { slug: slug }))

    return this.response.item(role, new RoleTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin list roles' })
  @ApiOkResponse({ description: 'List roles with query param' })
  async readRoles(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    let queryBuilder: SelectQueryBuilder<RoleEntity> =
      await this.roleService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        sortBy,
        sortType,
      })

    let joinAndSelects = []

    if (!isNil(includes)) {
      const includesParams = Array.isArray(includes) ? includes : [includes]

      joinAndSelects = this.primitiveService.includesParamToJoinAndSelects({
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

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const roles = await this.roleService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(
        roles,
        new RoleTransformer(
          joinAndSelects.length > 0 ? joinAndSelects : undefined,
        ),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new RoleTransformer(
        joinAndSelects.length > 0 ? joinAndSelects : undefined,
      ),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get role by id' })
  @ApiOkResponse({ description: 'Role entity' })
  async readRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const role = await this.roleService.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(role, new RoleTransformer(this.relations))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update role by id' })
  @ApiOkResponse({ description: 'Update role entity' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ): Promise<UpdateResponse> {
    const slug = await this.roleService.generateSlug(data.name)

    const role = await this.roleService.update(id, assign(data, { slug: slug }))

    return this.response.item(role, new RoleTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete role by id' })
  @ApiOkResponse({ description: 'Delete role successfully' })
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.roleService.findOneOrFail(id)

    await this.roleService.destroy(id)

    const rolePermissions: RolePermissionEntity[] =
      await this.rolePermissionService.findWhere({ roleId: id })

    const rolePermissionIds: number[] = rolePermissions.map(
      (rolePermission) => rolePermission.id,
    )

    await this.rolePermissionService.destroy(rolePermissionIds)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['role'],
      }),
    })
  }
}
