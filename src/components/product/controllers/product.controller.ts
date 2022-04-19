import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { ProductService } from '../services/product.service';
import { ProductTransformer } from '../transformers/product.transformer';

@ApiTags('Products')
@Controller('/api/products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private response: ApiResponseService,
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
}
