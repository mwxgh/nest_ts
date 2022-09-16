import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service'
import { getManager } from 'typeorm'
import { CartEntity } from '../entities/cart.entity'
import { CartService } from '../services/cart.service'
import { CartTransformer } from '../transformers/cart.transformer'

import { CreateCartItemDto } from '../dto/cart.dto'
import { ImageAbleType } from '../../image/entities/imageAble.entity'
import { SuccessfullyOperation } from 'src/shared/services/apiResponse/apiResponse.interface'
import Messages from 'src/shared/message/message'
import { CommonService } from 'src/shared/services/common.service'

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
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Cart created' })
  async create(@Body() data: CreateCartItemDto): Promise<any> {
    const cart = await this.cartService.create(data)

    return this.response.item(cart, new CartTransformer())
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<any> {
    const data = await getManager()
      .createQueryBuilder(CartEntity, 'carts')
      .leftJoinAndSelect('carts.items', 'cartItems')
      .leftJoinAndSelect('cartItems.product', 'products')
      .leftJoinAndSelect(
        'products.images',
        'images',
        'images.imageAbleType = :imageAbleType',
        { imageAbleType: ImageAbleType.product },
      )
      .where('carts.id = :id', { id: Number(id) })
      .getOne()

    if (!data) throw new NotFoundException()

    return this.response.item(data, new CartTransformer())
  }

  @Delete()
  @ApiOperation({ summary: 'Delete cart by id' })
  @ApiOkResponse({ description: 'Delete cart successfully' })
  async deleteCart(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.cartService.findOneOrFail(id)

    await this.cartService.destroy(Number(id))

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['tag'],
      }),
    })
  }
}
