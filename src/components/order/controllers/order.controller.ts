import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateResponse } from '@shared/interfaces/response.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { OrderService } from '../services/order.service'
import { OrderTransformer } from '../transformers/order.transformer'

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
    return { message: 'Error method!' }
  }

  @Post()
  async create(@Body() data: CreateOrderDto): Promise<CreateResponse> {
    data.status = data.status || 1
    const order = await this.orderService.create(data)
    return this.response.item(order, new OrderTransformer())
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderDto,
  ): Promise<any> {
    await this.orderService.checkExisting({ where: { id } })

    await this.orderService.update(id, data)

    return this.response.success()
  }
}
