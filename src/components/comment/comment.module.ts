import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { commentProviders } from './comment.providers'
import { UserCommentController } from './controllers/comment.controller'
import { CommentEntity } from './entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), ConfigModule],
  providers: [...commentProviders],
  controllers: [UserCommentController],
})
export class CommentModule {}
