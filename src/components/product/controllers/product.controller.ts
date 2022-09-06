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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { ProductTransformer } from '../transformers/product.transformer';
import { ImageService } from '../../image/services/image.service';
import { CategoryAbleService } from '../../category/services/categoryAble.service';
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
import { QueryManyDto } from 'src/shared/dto/queryParams.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { ImageAbleType } from '../../image/entities/imageAble.entity';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { SuccessfullyOperation } from 'src/shared/services/apiResponse/apiResponse.interface';
import Messages from 'src/shared/message/message';
import { CommonService } from 'src/shared/services/common.service';

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
    private imagesService: ImageService,
    private categoryAbleService: CategoryAbleService,
    private commonService: CommonService,
  ) {}

  private entity = 'products';
  private fields = ['name'];

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new product' })
  @ApiOkResponse({ description: 'New product entity' })
  async createProduct(
    @Body() data: CreateProductDto,
  ): Promise<{ [key: string]: any }> {
    const product = await this.productService.createProduct(data);

    return this.response.item(product, new ProductTransformer());
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({ description: 'List products with query param' })
  async readProducts(@Query() query: QueryManyDto): Promise<any> {
    const { search, includes, sortBy, sortType } = query;

    const queryBuilder = await this.productService.queryProduct({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
      includes,
    });

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      };

      const products = await this.productService.paginate(
        queryBuilder,
        paginateOption,
      );

      return this.response.paginate(products, new ProductTransformer(includes));
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ProductTransformer(includes),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ description: 'Product entity' })
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const product = await this.productService.findOneOrFail(id, {
      relations: ['images', 'categories'],
    });

    return this.response.item(
      product,
      new ProductTransformer(['images', 'categories']),
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ): Promise<SuccessfullyOperation> {
    await this.productService.findOneOrFail(id);

    const product = await this.productService.update(id, data);

    if (data.images) {
      data.images.forEach(async (item) => {
        if (item['url']) {
          const img = {
            url: item['url'],
            imageAbleId: product.id,
            imageAbleType: ImageAbleType.product,
          };
          await this.imagesService.create(img);
        }
      });
    }

    if (data.categoryId && data.categoryId != null) {
      const cate = {
        categoryId: data.categoryId,
        categoryAbleId: product.id,
        categoryAbleType: CategoryAbleType.product,
      };
      await this.categoryAbleService.create(cate);
    }
    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: ['product'],
      }),
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param() params): Promise<any> {
    await this.productService.findOneOrFail(params.id);

    await this.productService.destroy(params.id);

    return this.response.success();
  }
}
