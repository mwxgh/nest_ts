import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentProviders } from './comment.providers';
import { AdminCommentController } from './controllers/admin.comment.controller';
import { UserCommentController } from './controllers/comment.controller';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ConfigModule],
  providers: [...commentProviders],
  controllers: [AdminCommentController, UserCommentController],
})
export class CommentModule {}
