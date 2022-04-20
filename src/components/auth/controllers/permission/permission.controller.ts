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

  @Get()
  @Auth('admin')
  async index(
    @Query() query: { perPage: number; page: number; search: string },
  ): Promise<any> {
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
    const role = await this.permissionService.find(id);

    return this.response.item(role, new PermissionTransformer());
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<any> {
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
    await this.permissionService.destroy(id);

    return this.response.success();
  }
}
