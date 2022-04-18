import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../dto/category.dto';
import { CategoryService } from '../services/category.service';
import { CategoryTransformer } from '../transformers/category.transformer';

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

  @Get('listPaginate')
  async index(@Query() query: any): Promise<any> {
    query = query ? query : { page: 1, limit: 10 };

    const queryInclude = await this.categoryService.queryInclude(query);

    const data = await this.categoryService.paginate(queryInclude, query);

    return this.response.paginate(data, new CategoryTransformer());
  }

  @Get('list')
  async list(@Query() query: any): Promise<any> {
    const queryInclude = await this.categoryService.queryInclude(query);

    return this.response.collection(
      await queryInclude.getMany(),
      new CategoryTransformer(),
    );
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const category = await this.categoryService.find(id);

    if (!category) {
      throw new NotFoundException();
    }
    return this.response.item(category, new CategoryTransformer());
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Category created' })
  async create(@Body() data: CreateCategoryParams): Promise<any> {
    const category = await this.categoryService.create(data);
    return this.response.item(category, new CategoryTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(
    @Param() params,
    @Body() data: UpdateCategoryParams,
  ): Promise<any> {
    const category = await this.categoryService.find(params.id);
    if (!category) {
      throw new NotFoundException();
    }
    await this.categoryService.update(params.id, data);
    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param() params): Promise<any> {
    const category = await this.categoryService.find(params.id);
    if (!category) {
      throw new NotFoundException();
    }
    await this.categoryService.destroy(params.id);
    return this.response.success();
  }
}
