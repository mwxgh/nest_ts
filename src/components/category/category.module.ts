import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { categoryProviders } from './category.providers'
import { CategoryController } from './controllers/category.controller'
import { CategoryEntity } from './entities/category.entity'
import { CategoryAbleEntity } from './entities/categoryAble.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryAbleEntity]),
    ConfigModule,
  ],
  controllers: [CategoryController],
  providers: [...categoryProviders],
})
export class CategoryModule {}
