import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers/post.controller';
import { PostAble } from './entities/post.entity';
import { postProviders } from './post.providers';

@Module({
  imports: [TypeOrmModule.forFeature([PostAble]), ConfigModule],
  controllers: [PostController],
  providers: [...postProviders],
})
export class PostModule {}
