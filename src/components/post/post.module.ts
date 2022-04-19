import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPostController } from './controllers/admin.post.controller';
import { UserPostControllers } from './controllers/post.controller';
import { PostAble } from './entities/post.entity';
import { postProviders } from './post.providers';

@Module({
  imports: [TypeOrmModule.forFeature([PostAble]), ConfigModule],
  controllers: [AdminPostController, UserPostControllers],
  providers: [...postProviders],
})
export class PostModule {}
