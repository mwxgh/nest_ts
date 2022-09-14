import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers/post.controller';
import { PostEntity } from './entities/post.entity';
import { postProviders } from './post.providers';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), ConfigModule],
  controllers: [PostController],
  providers: [...postProviders],
})
export class PostModule {}
