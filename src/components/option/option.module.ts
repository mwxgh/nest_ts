import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionController } from './controllers/option.controller';
import { Option } from './entities/option.entity';
import { optionProviders } from './option.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Option]), ConfigModule],
  controllers: [OptionController],
  providers: [...optionProviders],
})
export class OptionModule {}
