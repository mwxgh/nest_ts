import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReactionEntity } from './entities/reaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity]), ConfigModule],
  providers: [],
  controllers: [],
})
export class ReactionModule {}
