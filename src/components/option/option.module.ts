import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOptionController } from './controllers/admin.option.controller';
import { UserOptionController } from './controllers/option.controller';
import { Option } from './entities/option.entity';
import { optionProviders } from './option.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Option]), ConfigModule],
  controllers: [AdminOptionController, UserOptionController],
  providers: [...optionProviders],
})
export class OptionModule {}
