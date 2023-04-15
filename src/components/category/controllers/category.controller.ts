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
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryService } from '../services/category.service'
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
    private category: CategoryService,
    private response: ApiResponseService,
  ) {}

  private entity = 'category'
  private fields = ['name']
  private relations = ['products', 'posts']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.category.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.create.apiOk })
  async createCategory(
    @Body() data: CreateCategoryDto,
  ): Promise<CreateResponse> {
    const category = await this.category.createCategory(data)

    return this.response.item(category, new CategoryTransformer())
  }

  @Get()
  @ApiOperation({ summary: APIDoc.category.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.read.apiOk })
  async readCategories(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { keyword, includes, sortBy, sortType } = query

    const [queryBuilder, includesParams]: [
      SelectQueryBuilder<CategoryEntity>,
      string[],
    ] = await this.category.queryCategory({
      entity: this.entity,
      fields: this.fields,
      relations: this.relations,
      keyword,
      includes,
      sortBy,
      sortType,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.category.paginationCalculate(queryBuilder, paginateOption),
        new CategoryTransformer(includesParams),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CategoryTransformer(includesParams),
    )
  }

  @Get('/hierarchical')
  @ApiOperation({ summary: APIDoc.category.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.detail.apiOk })
  async readCategoryHierarchical(): Promise<GetItemResponse> {
    const categories = await this.category.findAllHierarchical()

    return categories
  }

  @Get('/:id/children')
  @ApiOperation({ summary: APIDoc.category.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.detail.apiOk })
  async readCategoryChildren(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const category = await this.category.findOneWithChildren(id)

    return this.response.item(category, new CategoryTransformer(['children']))
  }

  @Get(':id')
  @ApiOperation({ summary: APIDoc.category.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.detail.apiOk })
  async readCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const category = await this.category.findOneOrFail(id)

    return this.response.item(category, new CategoryTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.category.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.update.apiOk })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<UpdateResponse> {
    const category = await this.category.updateCategory({ id, data })

    return this.response.item(category, new CategoryTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.category.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.category.delete.apiOk })
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.category.deleteCategory(id)

    return this.response.success({
      message: this.category.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
