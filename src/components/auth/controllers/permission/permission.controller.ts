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
} from '@nestjs/common';
import { ApiResponseService } from '../../../../shared/services/apiResponse/apiResponse.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionTransformer } from '../../transformers/permission.transformer';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { assign } from 'lodash';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../../dto/permission.dto';

import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { QueryListDto, QueryPaginateDto } from 'src/shared/dto/queryParams.dto';

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

  private entity = 'permissions';
  private fields = ['name'];

  @Get('listPaginate')
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin list permissions with query & paginate',
  })
  @ApiOkResponse({
    description: 'List permissions with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const baseQuery = await this.permissionService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: query.search,
    });

    const data = await this.permissionService.paginate(baseQuery, params);

    return this.response.paginate(data, new PermissionTransformer());
  }

  @Get('listQuery')
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin list permissions with query / without paginate',
  })
  @ApiOkResponse({
    description: 'List permissions with search & includes & filter',
  })
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const baseQuery = await this.permissionService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: query.search,
    });

    return this.response.collection(
      await baseQuery,
      new PermissionTransformer(),
    );
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get permission by id' })
  @ApiOkResponse({ description: 'Permission entity' })
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.permissionService.findOrFail(id);

    return this.response.item(role, new PermissionTransformer());
  }

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new permission' })
  @ApiOkResponse({ description: 'New permission entity' })
  async createPermission(@Body() data: CreatePermissionDto): Promise<any> {
    const slug = await this.permissionService.generateSlug(data.name);

    const role = await this.permissionService.create(
      assign(data, { slug: slug }),
    );

    return this.response.item(role, new PermissionTransformer());
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update permission by id' })
  @ApiOkResponse({ description: 'Update permission entity' })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<any> {
    await this.permissionService.findOrFail(id);

    const slug = await this.permissionService.generateSlug(data.name);

    const role = await this.permissionService.update(
      id,
      assign(data, { slug: slug }),
    );

    return this.response.item(role, new PermissionTransformer());
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete permission by id' })
  @ApiOkResponse({ description: 'Delete permission successfully' })
  async delete(@Param('id', ParseIntPipe) id: string): Promise<any> {
    await this.permissionService.findOrFail(id);

    await this.permissionService.destroy(id);

    return this.response.success();
  }
}
