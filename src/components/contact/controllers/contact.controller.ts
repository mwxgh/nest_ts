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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { ContactService } from '../services/contact.service';
import { ContactTransformer } from '../transformers/contact.transformer';

@ApiTags('Contacts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/admin/contacts')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private response: ApiResponseService,
  ) {}

  private entity = 'contacts';

  private fields = ['email', 'phone', 'address'];

  @Get('listPaginate')
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const baseQuery = await this.contactService.queryBuilder(
      this.entity,
      this.fields,
      query.search,
    );

    const contact = await this.contactService.paginate(baseQuery, params);

    return this.response.paginate(contact, new ContactTransformer());
  }

  @Get('listQuery')
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const baseQuery = await this.contactService.queryBuilder(
      this.entity,
      this.fields,
      query.search,
    );
    return this.response.collection(await baseQuery, new ContactTransformer());
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateContactDto,
  ): Promise<any> {
    await this.contactService.findOrFail(id);

    await this.contactService.update(id, data);

    return this.response.success();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.contactService.findOrFail(id);

    await this.contactService.destroy(id);

    return this.response.success();
  }
}
