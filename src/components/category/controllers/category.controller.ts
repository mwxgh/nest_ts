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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { IPaginationOptions } from 'src/shared/services/pagination';
import { QueryListDto, QueryPaginateDto } from 'src/shared/dto/queryParams.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';
import { CategoryTransformer } from '../transformers/category.transformer';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';

@ApiTags('Categories')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private response: ApiResponseService,
  ) {}

  private entity = 'categories';
  private fields = ['name', 'categoryType'];

  @Get('listPaginate')
  @ApiOperation({
    summary: 'List categories with query & paginate',
  })
  @ApiOkResponse({
    description: 'List categories with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: query.perPage ? query.perPage : 10,
      page: query.page ? query.page : 1,
    };

    const { search, includes } = query;

    const queryInclude = await this.categoryService.queryCategory(
      this.entity,
      this.fields,
      search,
      includes,
    );

    const data = await this.categoryService.paginate(queryInclude, params);

    return this.response.paginate(data, new CategoryTransformer());
  }

  @Get('listQuery')
  @ApiOperation({ summary: 'List categories with query / without paginate' })
  @ApiOkResponse({
    description: 'List categories with search & includes & filter',
  })
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const { search, includes } = query;

    const queryInclude = await this.categoryService.queryCategory(
      this.entity,
      this.fields,
      search,
      includes,
    );

    return this.response.collection(
      await queryInclude.getMany(),
      new CategoryTransformer(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ description: 'Category entity' })
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const category = await this.categoryService.findOrFail(id);

    return this.response.item(category, new CategoryTransformer());
  }

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new category' })
  @ApiOkResponse({ description: 'New category entity' })
  async create(@Body() data: CreateCategoryDto): Promise<any> {
    const category = await this.categoryService.create(data);

    return this.response.item(category, new CategoryTransformer());
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update category by id' })
  @ApiOkResponse({ description: 'Update category entity' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<any> {
    await this.categoryService.findOrFail(id);

    await this.categoryService.update(id, data);

    return this.response.success();
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete category by id' })
  @ApiOkResponse({ description: 'Delete category successfully' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.categoryService.findOrFail(id);

    await this.categoryService.destroy(id);

    return this.response.success();
  }
}
