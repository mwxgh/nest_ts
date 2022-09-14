import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from '../image/controllers/images.controller';
import { ProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { productProviders } from './product.providers';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ConfigModule],
  providers: [...productProviders],
  controllers: [ProductController, ImageController],
})
export class ProductModule {}
