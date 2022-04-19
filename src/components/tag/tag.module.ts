import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminTagController } from './controllers/tag.admin.controller';
import { UserTagController } from './controllers/tag.controller';
import { TagName } from './entities/tag.entity';
import { TagAble } from './entities/tagAble.entity';
import { tagProviders } from './tag.providers';

@Module({
  imports: [TypeOrmModule.forFeature([TagName, TagAble]), ConfigModule],
  providers: [...tagProviders],
  controllers: [UserTagController, AdminTagController],
})
export class TagModule {}
