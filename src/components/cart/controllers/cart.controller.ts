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
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { getManager } from 'typeorm'
import { CartEntity } from '../entities/cart.entity'
import { CartService } from '../services/cart.service'
import { CartTransformer } from '../transformers/cart.transformer'

import { ImageAbleType } from '@imageModule/entities/imageAble.entity'
import {
  CreateResponse,
  GetItemResponse,
  SuccessfullyOperation,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { PrimitiveService } from '@shared/services/primitive.service'
import { CreateCartItemDto } from '../dto/cart.dto'

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
    private primitiveService: PrimitiveService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Cart created' })
  async create(@Body() data: CreateCartItemDto): Promise<CreateResponse> {
    const cart = await this.cartService.create(data)

    return this.response.item(cart, new CartTransformer())
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<GetItemResponse> {
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
    await this.cartService.checkExisting({ where: { id } })

    await this.cartService.destroy(Number(id))

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['tag'],
      }),
    })
  }
}
