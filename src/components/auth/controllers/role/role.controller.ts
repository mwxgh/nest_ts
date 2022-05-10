import {
  Controller,
  Get,
  Query,
  Post,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { RoleService } from '../../services/role.service';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import { Auth } from '../../decorators/auth.decorator';
import { RoleTransformer } from '../../transformers/role.transformer';
import { assign } from 'lodash';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryManyDto } from 'src/shared/dto/queryParams.dto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { CreateRoleDto, UpdateRoleDto } from '../../dto/role.dto';
import { RolePermissionService } from '../../services/rolePermission.service';

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
  ) {}

  private entity = 'roles';
  private fields = ['name', 'level'];

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new role' })
  @ApiOkResponse({ description: 'New role entity' })
  async createRole(@Body() data: CreateRoleDto): Promise<any> {
    const slug = await this.roleService.generateSlug(data.name);

    const role = await this.roleService.create(assign(data, { slug: slug }));

    return this.response.item(role, new RoleTransformer());
  }

  @Get()
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin list roles',
  })
  @ApiOkResponse({
    description: 'List roles with query param',
  })
  async readRoles(@Query() query: QueryManyDto): Promise<any> {
    const { search, includes, sortBy, sortType } = query;

    let queryBuilder = await this.roleService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    });

    const relation = Array.isArray(includes) ? includes : [includes];

    console.log(relation);

    if (includes && relation.includes('permissions')) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        `${this.entity}.permissions`,
        'permissions',
      );
    }

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      };

      const roles = await this.roleService.paginate(
        queryBuilder,
        paginateOption,
      );

      return this.response.paginate(roles, new RoleTransformer(relation));
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new RoleTransformer(relation),
    );
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get role by id' })
  @ApiOkResponse({ description: 'Role entity' })
  async readRole(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.roleService.findOneOrFail(id, {
      relations: ['permissions'],
    });

    return this.response.item(role, new RoleTransformer(['permissions']));
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update role by id' })
  @ApiOkResponse({ description: 'Update role entity' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ): Promise<any> {
    const slug = await this.roleService.generateSlug(data.name);

    const role = await this.roleService.update(
      id,
      assign(data, { slug: slug }),
    );

    return this.response.item(role, new RoleTransformer());
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete role by id' })
  @ApiOkResponse({ description: 'Delete role successfully' })
  async deleteRole(@Param('id', ParseIntPipe) id: string): Promise<any> {
    await this.roleService.findOneOrFail(id);

    await this.roleService.destroy(id);

    const rolePermissions = await this.rolePermissionService.findWhere({
      where: { roleId: id },
    });

    const rolePermissionIds = rolePermissions.map(
      (rolePermission) => rolePermission.id,
    );

    await this.rolePermissionService.destroy(rolePermissionIds);

    return this.response.success();
  }
}
