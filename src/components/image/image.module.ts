import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './controllers/images.controller';
import { Image } from './entities/image.entity';
import { imageProviders } from './image.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), ConfigModule],
  controllers: [ImageController],
  providers: [...imageProviders],
})
export class ImageModule {}
