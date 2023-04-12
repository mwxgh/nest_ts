import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagController } from './controllers/tag.controller'

import { TagEntity } from './entities/tag.entity'
import { TagAbleEntity } from './entities/tagAble.entity'
import { TagAbleService } from './services/tagAble.service'
import { tagProviders } from './tag.providers'

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, TagAbleEntity]), ConfigModule],
  providers: [...tagProviders],
  controllers: [TagController],
  exports: [TagAbleService],
})
export class TagModule {}
