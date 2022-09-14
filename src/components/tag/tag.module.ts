import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './controllers/tag.controller';

import { TagEntity } from './entities/tag.entity';
import { TagAble } from './entities/tagAble.entity';
import { tagProviders } from './tag.providers';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, TagAble]), ConfigModule],
  providers: [...tagProviders],
  controllers: [TagController],
})
export class TagModule {}
