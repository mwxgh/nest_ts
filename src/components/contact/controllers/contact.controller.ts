import { Body, Controller, Post } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { CreateContactDto } from '../dto/contact.dto';
import { ContactService } from '../services/contact.service';
import { ContactTransformer } from '../transformers/contact.transformer';

@ApiTags('Contacts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/contacts')
export class UserContactController {
  constructor(
    private contactService: ContactService,
    private response: ApiResponseService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Contact created' })
  async create(@Body() data: CreateContactDto): Promise<any> {
    const contact = await this.contactService.create(data);
    return this.response.item(contact, new ContactTransformer());
  }
}
