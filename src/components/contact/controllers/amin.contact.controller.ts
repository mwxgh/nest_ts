import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
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

  @Get('listPaginate')
  async index(
    @Query() query: { perPage: number; page: number; search: string },
  ): Promise<any> {
    const params: IPaginationOptions = {
      limit: 10,
      page: 1,
    };
    const entity = 'contacts';

    const fields = ['email', 'phone', 'address'];

    const keyword = query.search;

    const baseQuery = await this.contactService.queryBuilder(
      entity,
      fields,
      keyword,
    );

    const contact = await this.contactService.paginate(baseQuery, params);

    return this.response.paginate(contact, new ContactTransformer());
  }

  @Get('list')
  async list(): Promise<any> {
    const contact = await this.contactService.findAllOrFail();
    return this.response.collection(contact, new ContactTransformer());
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const contact = await this.contactService.findOrFail(id);

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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateContactDto,
  ): Promise<any> {
    await this.contactService.findOrFail(id);

    await this.contactService.update(id, data);

    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.contactService.findOrFail(id);

    await this.contactService.destroy(id);

    return this.response.success();
  }
}
