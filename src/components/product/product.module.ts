import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from '../image/controllers/images.controller';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { productProviders } from './product.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ConfigModule],
  providers: [...productProviders],
  controllers: [ProductController, ImageController],
})
export class ProductModule {}
