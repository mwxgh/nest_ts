import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';
import { OrderService } from '../services/order.service';
import { OrderTransformer } from '../transformers/order.transformer';

@ApiTags('Orders')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private response: ApiResponseService,
  ) {}

  @Get()
  async index(): Promise<any> {
    return { message: 'Error method!' };
  }

  @Post()
  async create(@Body() data: CreateOrderDto): Promise<any> {
    data.status = data.status || 1;
    const order = await this.orderService.create(data);
    return this.response.item(order, new OrderTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() data: UpdateOrderDto): Promise<any> {
    await this.orderService.findOneOrFail(params.id);

    await this.orderService.update(params.id, data);

    return await this.response.success();
  }
}
