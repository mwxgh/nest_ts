import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductController } from './controllers/product.controller'
import { ProductEntity } from './entities/product.entity'
import { productProviders } from './product.providers'

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ConfigModule],
  providers: [...productProviders],
  controllers: [ProductController],
})
export class ProductModule {}
