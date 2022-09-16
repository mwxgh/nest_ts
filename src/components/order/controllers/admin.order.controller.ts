import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto'
import { OrderService } from '../services/order.service'
import { OrderProductService } from '../services/orderProduct.service'
import { OrderTransformer } from '../transformers/order.transformer'

@ApiTags('Orders')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/admin/orders')
export class AdminOrderController {
  constructor(
    private orderService: OrderService,
    private response: ApiResponseService,
    private orderProductService: OrderProductService,
  ) {}

  @Get('listPaginate')
  async index(@Query() query: any): Promise<any> {
    query = query || { page: 1, limit: 10 }

    const { baseQuery } = await this.orderService.baseQuery()

    const order = await this.orderService.paginate(baseQuery, query)
    return this.response.paginate(order, new OrderTransformer())
  }

  @Get('list')
  async list(): Promise<any> {
    const { baseQuery } = await this.orderService.baseQuery()

    return this.response.collection(
      await baseQuery.getMany(),
      new OrderTransformer(),
    )
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  async show(@Param() params): Promise<any> {
    const { baseQuery } = await this.orderService.baseQuery(params.id)

    return this.response.item(await baseQuery.getOne(), new OrderTransformer())
  }

  @Post()
  async create(@Body() data: CreateOrderDto): Promise<any> {
    data.status = data.status || 1
    const order = await this.orderService.create(data)
    return this.response.item(order, new OrderTransformer())
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() data: UpdateOrderDto): Promise<any> {
    await this.orderService.findOneOrFail(params.id)

    await this.orderService.update(params.id, data)

    return this.response.success()
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param() params): Promise<any> {
    await this.orderService.findOneOrFail(params.id)

    await this.orderService.destroy(params.id)

    return this.response.success()
  }
}
