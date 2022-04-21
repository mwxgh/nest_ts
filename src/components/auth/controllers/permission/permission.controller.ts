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
} from '@nestjs/common';
import { ApiResponseService } from '../../../../shared/services/apiResponse/apiResponse.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionTransformer } from '../../transformers/permission.transformer';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { assign } from 'lodash';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../../dto/permission.dto';
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';

@ApiTags('Permissions')
@ApiBearerAuth()
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
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const keyword = query.search;

    const baseQuery = await this.permissionService.queryBuilder(
      this.entity,
      this.fields,
      keyword,
    );

    const data = await this.permissionService.paginate(baseQuery, params);

    return this.response.paginate(data, new PermissionTransformer());
  }

  @Get('listQuery')
  @Auth('admin')
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const keyword = query.search;

    const baseQuery = await this.permissionService.queryBuilder(
      this.entity,
      this.fields,
      keyword,
    );
    return this.response.collection(
      await baseQuery,
      new PermissionTransformer(),
    );
  }

  @Get('list')
  @Auth('admin')
  async list(): Promise<any> {
    const contact = await this.permissionService.findAllOrFail();
    return this.response.collection(contact, new PermissionTransformer());
  }

  @Post('')
  @Auth('admin')
  async saveObjective(@Body() data: CreatePermissionDto): Promise<any> {
    const slug = await this.permissionService.generateSlug(data.name);

    const role = await this.permissionService.create(
      assign(data, { slug: slug }),
    );

    return this.response.item(role, new PermissionTransformer());
  }

  @Get(':id')
  @Auth('admin')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.permissionService.findOrFail(id);

    return this.response.item(role, new PermissionTransformer());
  }

  @Put(':id')
  @Auth('admin')
  async update(
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
  async delete(@Param('id', ParseIntPipe) id: string): Promise<any> {
    await this.permissionService.findOrFail(id);

    await this.permissionService.destroy(id);

    return this.response.success();
  }
}
