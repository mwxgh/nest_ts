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
} from '@nestjs/common';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { RoleService } from '../../services/role.service';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import { Auth } from '../../decorators/auth.decorator';
import { RoleTransformer } from '../../transformers/role.transformer';
import { assign } from 'lodash';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/components/category/dto/category.dto';
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('api/v1/roles')
export class RoleController {
  constructor(
    private response: ApiResponseService,
    private roleService: RoleService,
  ) {}

  private entity = 'roles';

  private fields = ['name', 'level'];

  @Get('listPaginate')
  @Auth('admin')
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const keyword = query.search;

    const baseQuery = this.roleService.queryBuilder(
      this.entity,
      this.fields,
      keyword,
    );

    const data = await this.roleService.paginate(await baseQuery, params);

    return this.response.paginate(data, new RoleTransformer([]));
  }

  @Get('listQuery')
  @Auth('admin')
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const keyword = query.search;

    const baseQuery = await this.roleService.queryBuilder(
      this.entity,
      this.fields,
      keyword,
    );
    return this.response.collection(await baseQuery, new RoleTransformer([]));
  }

  @Get('list')
  @Auth('admin')
  async list(): Promise<any> {
    const contact = await this.roleService.findAllOrFail();
    return this.response.collection(contact, new RoleTransformer([]));
  }

  @Post('')
  @Auth('admin')
  async saveObjective(@Body() data: CreateCategoryDto): Promise<any> {
    const slug = await this.roleService.generateSlug(data.name);

    const role = await this.roleService.create(assign(data, { slug: slug }));

    return this.response.item(role, new RoleTransformer());
  }

  @Get(':id')
  @Auth('admin')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.roleService.find(id, {
      relations: ['permissions'],
    });

    return this.response.item(role, new RoleTransformer(['permissions']));
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
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
  async delete(@Param('id', ParseIntPipe) id: string): Promise<any> {
    await this.roleService.destroy(id);

    return this.response.success();
  }
}
