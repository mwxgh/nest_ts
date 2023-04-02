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

import { Auth } from '@authModule/decorators/auth.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
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
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { SelectQueryBuilder } from 'typeorm'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryService } from '../services/category.service'
import { CategoryAbleService } from '../services/categoryAble.service'
import { CategoryTransformer } from '../transformers/category.transformer'

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
    private categoryAbleService: CategoryAbleService,
  ) {}

  private entity = 'category'
  private fields = ['name', 'categoryType']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new category' })
  @ApiOkResponse({ description: 'New category entity' })
  async createCategory(
    @Body() data: CreateCategoryDto,
  ): Promise<CreateResponse> {
    const category = await this.categoryService.createCategory(data)

    return this.response.item(category, new CategoryTransformer())
  }

  @Get()
  @ApiOperation({ summary: 'Get list categories' })
  @ApiOkResponse({ description: 'List categories with param query' })
  async readCategories(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { keyword, includes, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<CategoryEntity> =
      await this.categoryService.queryCategory({
        entity: this.entity,
        fields: this.fields,
        keyword,
        includes,
        sortBy,
        sortType,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.categoryService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(data, new CategoryTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CategoryTransformer(),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ description: 'Category entity' })
  async readCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const category = await this.categoryService.findOneOrFail(id)

    return this.response.item(category, new CategoryTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update category by id' })
  @ApiOkResponse({ description: 'Update category entity' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<UpdateResponse> {
    await this.categoryService.checkExisting({ where: id })

    const category = await this.categoryService.update(id, data)

    return this.response.item(category, new CategoryTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete category by id' })
  @ApiOkResponse({ description: 'Delete category successfully' })
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.categoryService.checkExisting({ where: { id } })

    await this.categoryService.destroy(id)

    await this.categoryAbleService.detachCategoryAble([{ categoryId: id }])

    return this.response.success({
      message: this.categoryService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
