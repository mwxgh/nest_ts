import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cartProviders } from './cart.providers';
import { CartController } from './controllers/cart.controller';
import { CartItemController } from './controllers/cartItem.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ConfigModule],
  providers: [...cartProviders],
  controllers: [CartController, CartItemController],
})
export class CartModule {}
