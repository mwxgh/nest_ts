import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductService } from 'src/components/product/services/product.service';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { getCustomRepository } from 'typeorm';
import { CreateOrderProductDto, UpdateOrderProductDto } from '../dto/order.dto';
import { OrderProductRepository } from '../repositories/orderProduct.repository';
import { OrderService } from '../services/order.service';
import { OrderProductService } from '../services/orderProduct.service';

@ApiTags('Orders')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/order-product')
export class OrderProductController {
  constructor(
    private orderService: OrderService,
    private orderProductService: OrderProductService,
    private response: ApiResponseService,
    private productService: ProductService,
  ) {}

  @Post()
  async create(@Body() data: CreateOrderProductDto): Promise<any> {
    await this.orderService.findOrFail(data.orderId);

    let total = 0;

    data.products.forEach(async (item) => {
      const result = await this.productService.find(item.productId);
      if (result && item.quantity > 0) {
        const amount = Number(item.quantity) * Number(result.price);
        total += amount;

        const record = {
          orderId: data.orderId,
          productId: item.productId,
          quantity: item.quantity,
          amount: amount,
        };
        await this.orderProductService.create(record);
        await this.orderService.update(data.orderId, { amount: total });
      }
    });

    return this.response.success();
  }

  @Put()
  async update(@Body() data: UpdateOrderProductDto): Promise<any> {
    await this.orderService.findOrFail(data.orderId);

    const list_order = await getCustomRepository(OrderProductRepository)
      .createQueryBuilder('orderProducts')
      .where('orderProducts.orderId = :orderId', { orderId: data.orderId })
      .getMany();

    list_order.forEach(async (item) => {
      await this.orderProductService.destroy(item.id);
    });

    let total = 0;

    data.products.forEach(async (item) => {
      const result = await this.productService.find(item.productId);

      if (result && item.quantity > 0) {
        const amount = Number(item.quantity) * Number(result.price);
        total += Number(amount);

        const record = {
          orderId: data.orderId,
          productId: item.productId,
          quantity: item.quantity,
          amount: amount,
        };
        await this.orderProductService.create(record);
        await this.orderService.update(data.orderId, { amount: total });
      }
    });

    return await this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async destroy(@Param() params: any): Promise<any> {
    const record = await this.orderProductService.findOrFail(params.id);

    const order = await this.orderService.find(record.orderId);

    await this.orderService.update(order.id, {
      amount: order.amount - record.amount,
    });

    await this.orderProductService.destroy(params.id);

    return this.response.success();
  }
}
