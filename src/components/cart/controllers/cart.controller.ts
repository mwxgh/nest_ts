import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service';
import { getManager } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartService } from '../services/cart.service';
import { CartTransformer } from '../transformers/cart.transformer';
import { ImageAbleType } from '../../../components/image/entities/image.entity';
import { CreateCartItemDto } from '../dto/cart.dto';

@ApiTags('Carts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/cart')
export class CartController {
  constructor(
    private response: ApiResponseService,
    private cartService: CartService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Cart created' })
  async create(@Body() data: CreateCartItemDto): Promise<any> {
    const cart = await this.cartService.create(data);

    return this.response.item(cart, new CartTransformer());
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<any> {
    const data = await getManager()
      .createQueryBuilder(Cart, 'carts')
      .leftJoinAndSelect('carts.items', 'cartItems')
      .leftJoinAndSelect('cartItems.product', 'products')
      .leftJoinAndSelect(
        'products.images',
        'images',
        'images.imageAbleType = :imageAbleType',
        { imageAbleType: ImageAbleType.PRODUCT },
      )
      .where('carts.id = :id', { id: Number(id) })
      .getOne();

    if (!data) throw new NotFoundException();

    return this.response.item(data, new CartTransformer());
  }

  @Delete()
  async destroy(@Param('id') id: string): Promise<any> {
    await this.cartService.findOrFail(id);

    await this.cartService.destroy(Number(id));

    return this.response.success();
  }
}
