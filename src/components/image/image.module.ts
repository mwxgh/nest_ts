import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageController } from './controllers/images.controller'
import { ImageEntity } from './entities/image.entity'
import { ImageAbleEntity } from './entities/imageAble.entity'
import { imageProviders } from './image.providers'
import { ImageAbleService } from './services/imageAble.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity, ImageAbleEntity]),
    ConfigModule,
  ],
  controllers: [ImageController],
  providers: [...imageProviders],
  exports: [ImageAbleService],
})
export class ImageModule {}
