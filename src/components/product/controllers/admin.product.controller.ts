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
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { ProductTransformer } from '../transformers/product.transformer';
import { ImageService } from '../../image/services/image.service';
import { ImageAbleType } from '../../image/entities/image.entity';
import { CategoryAbleService } from '../../../components/category/services/categoryAble.service';
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity';

@ApiTags('Products')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/admin/products')
export class AdminProductController {
  constructor(
    private response: ApiResponseService,
    private productService: ProductService,
    private imagesService: ImageService,
    private categoryAbleService: CategoryAbleService,
  ) {}

  @Get()
  async index(@Query() query: any): Promise<any> {
    query = query ? query : { page: 1, limit: 10 };

    const { include, queryInclude } = await this.productService.queryInclude(
      query.include,
    );

    const data = await this.productService.paginate(queryInclude, query);
    return this.response.paginate(data, new ProductTransformer(include));
  }

  @Get('list')
  async list(@Query() query: any): Promise<any> {
    const { include, queryInclude } = await this.productService.queryInclude(
      query.include,
    );

    return this.response.collection(
      await queryInclude.getMany(),
      new ProductTransformer(include),
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ): Promise<any> {
    const { include, queryInclude } = await this.productService.queryInclude(
      query.include,
      id,
    );

    return this.response.item(
      await queryInclude.getOne(),
      new ProductTransformer(include),
    );
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Product created' })
  async store(@Body() data: CreateProductDto): Promise<{ [key: string]: any }> {
    const product = await this.productService.createProduct(data);
    return this.response.item(product, new ProductTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() data: UpdateProductDto): Promise<any> {
    await this.productService.findOrFail(params.id);

    const product = await this.productService.update(params.id, data);

    if (data.images) {
      data.images.forEach(async (item) => {
        if (item['url']) {
          const img = {
            url: item['url'],
            imageAbleId: product.id,
            imageAbleType: ImageAbleType.PRODUCT,
          };
          await this.imagesService.create(img);
        }
      });
    }

    if (data.categoryId && data.categoryId != null) {
      const cate = {
        categoryId: data.categoryId,
        categoryAbleId: product.id,
        categoryAbleType: CategoryAbleType.PRODUCT,
      };
      await this.categoryAbleService.create(cate);
    }
    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param() params): Promise<any> {
    await this.productService.findOrFail(params.id);

    await this.productService.destroy(params.id);

    return this.response.success();
  }
}
