import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryProviders } from './category.providers';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { CategoryAble } from './entities/categoryAble.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAble]), ConfigModule],
  controllers: [CategoryController],
  providers: [...categoryProviders],
})
export class CategoryModule {}
