import { Auth } from '@authModule/decorators/auth.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
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
import { ProductEntity } from '@productModule/entities/product.entity'
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
  UpdateResponse,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { PrimitiveService } from '@shared/services/primitive.service'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { ProductService } from '../services/product.service'
import { ProductTransformer } from '../transformers/product.transformer'

@ApiTags('Products')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/products')
export class ProductController {
  constructor(
    private response: ApiResponseService,
    private productService: ProductService,
    private primitiveService: PrimitiveService,
  ) {}

  private entity = 'product'
  private fields = ['name']
  private relations: ['images', 'categories', 'tags']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.product.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.product.create.apiOk })
  async createProduct(
    @Body() data: CreateProductDto,
  ): Promise<SuccessfullyOperation> {
    await this.productService.createProduct(data)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    })
  }

  @Get()
  @ApiOperation({ summary: APIDoc.product.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.product.read.apiOk })
  async readProducts(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder, includesParams]: [
      SelectQueryBuilder<ProductEntity>,
      string[],
    ] = await this.productService.queryProduct({
      entity: this.entity,
      fields: this.fields,
      relations: this.relations,
      ...query,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.productService.paginationCalculate(
          queryBuilder,
          paginateOption,
        ),
        new ProductTransformer(includesParams),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ProductTransformer(includesParams),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: APIDoc.product.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.product.detail.apiOk })
  async readProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const product = await this.productService.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(product, new ProductTransformer(this.relations))
  }

  @Put(':id')
  @ApiOperation({ summary: APIDoc.product.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.product.update.apiOk })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ): Promise<UpdateResponse> {
    const product: ProductEntity = await this.productService.updateProduct({
      id,
      data,
    })

    return this.response.item(product, new ProductTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.product.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.product.delete.apiOk })
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.productService.deleteProduct(id)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
