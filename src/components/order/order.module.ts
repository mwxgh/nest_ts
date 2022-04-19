import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrderController } from './controllers/admin.order.controller';
import { OrderController } from './controllers/order.controller';
import { OrderProductController } from './controllers/orderProduct.controller';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/orderProduct.entity';
import { orderProviders } from './order.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct]), ConfigModule],
  providers: [...orderProviders],
  controllers: [AdminOrderController, OrderController, OrderProductController],
})
export class OrderModule {}
