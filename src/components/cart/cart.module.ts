import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cartProviders } from './cart.providers';
import { CartController } from './controllers/cart.controller';
import { CartItemController } from './controllers/cartItem.controller';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cartItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
    ConfigModule,
  ],
  providers: [...cartProviders],
  controllers: [CartController, CartItemController],
})
export class CartModule {}
