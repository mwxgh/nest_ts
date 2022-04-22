import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { contactProviders } from './contact.providers';
import { ContactController } from './controllers/contact.controller';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), ConfigModule],
  providers: [...contactProviders],
  controllers: [ContactController],
})
export class ContactModule {}
