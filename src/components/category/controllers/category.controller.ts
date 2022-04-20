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
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IPaginationOptions } from 'src/shared/services/pagination';
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';
import { CategoryTransformer } from '../transformers/category.transformer';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';

@ApiTags('Categories')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/admin/categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private response: ApiResponseService,
  ) {}

  private entity = 'categories';

  @Get('listPaginate')
  async index(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: query.perPage ? query.perPage : 10,
      page: query.page ? query.page : 1,
    };

    const queryInclude = await this.categoryService.queryCategory(
      this.entity,
      query,
    );

    const data = await this.categoryService.paginate(queryInclude, params);

    return this.response.paginate(data, new CategoryTransformer());
  }

  @Get('list')
  async list(@Query() query: QueryListDto): Promise<any> {
    const queryInclude = await this.categoryService.queryCategory(
      this.entity,
      query.includes,
    );

    return this.response.collection(
      await queryInclude.getMany(),
      new CategoryTransformer(),
    );
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const category = await this.categoryService.findOrFail(id);

    return this.response.item(category, new CategoryTransformer());
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Category created' })
  async create(@Body() data: CreateCategoryDto): Promise<any> {
    const category = await this.categoryService.create(data);

    return this.response.item(category, new CategoryTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<any> {
    await this.categoryService.findOrFail(id);

    await this.categoryService.update(id, data);

    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.categoryService.findOrFail(id);

    await this.categoryService.destroy(id);

    return this.response.success();
  }
}
