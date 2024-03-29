import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { CartEntity } from '@cartModule/entities/cart.entity'
import { ProductEntity } from '@productModule/entities/product.entity'
import { ProductService } from '@productModule/services/product.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { getManager } from 'typeorm'
import { CreateCartItemDto, UpdateCartItemDto } from '../dto/cart.dto'
import { CartItemEntity } from '../entities/cartItem.entity'
import { CartService } from '../services/cart.service'
import { CartItemService } from '../services/cartItem.service'
import { CartItemTransformer } from '../transformers/cartItem.transformer'

@ApiTags('Carts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/cartItem')
export class CartItemController {
  constructor(
    private response: ApiResponseService,
    private cartService: CartService,
    private cartItemService: CartItemService,
    private productService: ProductService,
  ) {}

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartItemDto,
  ): Promise<any> {
    if (!Number(id)) throw new NotFoundException()
    if (body.quantity <= 0) {
      await this.cartItemService.destroy(Number(id))
      return this.response.success()
    }

    await this.cartItemService.checkExisting({ where: { id } })

    const product: ProductEntity = await this.productService.findOneOrFail(
      body.productId,
    )

    const update_data = {
      quantity: `${body.quantity}`,
      amount: `${Number(product.price) * Number(body.quantity)}`,
      updated_at: new Date(),
    }
    await this.cartItemService.update(id, update_data)

    return this.response.success()
  }

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.cartItemService.checkExisting({ where: { id } })

    await this.cartItemService.destroy(Number(id))

    return this.response.success()
  }

  @Post()
  async store(@Body() body: CreateCartItemDto): Promise<any> {
    const productExist: ProductEntity = await this.productService.findOneOrFail(
      body.productId,
    )

    const cartExist: CartEntity = await this.cartService.findOneOrFail(
      body.cartId,
    )

    const data_check_cart_item = {
      productId: productExist.id,
      cartId: cartExist.id,
    }

    const check_cart_item = await getManager()
      .createQueryBuilder(CartItemEntity, 'cartItems')
      .where(
        'cartItems.productId = :productId  AND cartItems.cartId = :cartId ',
        data_check_cart_item,
      )
      .getOne()

    if (check_cart_item) {
      const data_update = {
        quantity: `${Number(
          body.quantity === 1 ? check_cart_item.quantity + 1 : body.quantity,
        )}`,
        amount: `${Number(
          body.quantity === 1
            ? productExist.price + check_cart_item.amount
            : productExist.price * body.quantity,
        )}`,
        updated_at: new Date(),
      }

      await this.cartItemService.update(check_cart_item.id, data_update)

      return this.response.success()
    }

    const data = {
      cartId: cartExist.id,
      productId: productExist.id,
      quantity: body.quantity,
      amount: Number(productExist.price) * body.quantity,
    }

    const data_item = await this.cartItemService.create(data)

    return this.response.item(data_item, new CartItemTransformer())
  }
}
