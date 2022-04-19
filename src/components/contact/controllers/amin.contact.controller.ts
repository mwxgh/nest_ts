import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { getCustomRepository } from 'typeorm';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { ContactRepository } from '../repositories/contact.repository';
import { ContactService } from '../services/contact.service';
import { ContactTransformer } from '../transformers/contact.transformer';

@ApiTags('Contacts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/admin/contacts')
export class AdminContactController {
  constructor(
    private contactService: ContactService,
    private response: ApiResponseService,
  ) {}

  @Get()
  async index(@Query() query: any): Promise<any> {
    query = query || { page: 1, limit: 10 };
    const query_buidler = await getCustomRepository(
      ContactRepository,
    ).createQueryBuilder('contacts');
    const contact = await this.contactService.paginate(query_buidler, query);
    return this.response.paginate(contact, new ContactTransformer());
  }

  @Get('list')
  async list(): Promise<any> {
    const contact = await this.contactService.get();
    return this.response.collection(contact, new ContactTransformer());
  }

  @Get(':id')
  async show(@Param() params: any): Promise<any> {
    const contact = await this.contactService.findOrFail(params.id);

    return this.response.collection(contact, new ContactTransformer());
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Contact created' })
  async create(@Body() data: CreateContactDto): Promise<any> {
    const contact = await this.contactService.create(data);
    return this.response.item(contact, new ContactTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() data: UpdateContactDto): Promise<any> {
    await this.contactService.findOrFail(params.id);

    await this.contactService.update(params.id, data);

    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param() params): Promise<any> {
    await this.contactService.findOrFail(params.id);

    await this.contactService.destroy(params.id);

    return this.response.success();
  }
}
