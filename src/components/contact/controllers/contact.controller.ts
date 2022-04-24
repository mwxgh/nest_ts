import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { AuthenticatedUser } from 'src/components/auth/decorators/authenticatedUser.decorator';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
import { User } from 'src/components/user/entities/user.entity';
import { QueryListDto, QueryPaginateDto } from 'src/shared/dto/queryParams.dto';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { ContactService } from '../services/contact.service';
import { ContactTransformer } from '../transformers/contact.transformer';
import * as _ from 'lodash';

@ApiTags('Contacts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/contacts')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private response: ApiResponseService,
  ) {}

  private entity = 'contacts';

  private fields = ['email', 'phone', 'address'];

  @Get('listPaginate')
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin list contacts with query & paginate',
  })
  @ApiOkResponse({
    description: 'List contacts with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const baseQuery = await this.contactService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: query.search,
    });

    const contacts = await this.contactService.paginate(baseQuery, params);

    return this.response.paginate(contacts, new ContactTransformer());
  }

  @Get('listQuery')
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin list contacts with query / without paginate',
  })
  @ApiOkResponse({
    description: 'List contacts with search & includes & filter',
  })
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const baseQuery = await this.contactService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: query.search,
    });

    const contacts = await baseQuery.getMany();

    return this.response.collection(contacts, new ContactTransformer());
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get contact by id' })
  @ApiOkResponse({ description: 'Contact entity' })
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const contact = await this.contactService.findOneOrFail(id);

    return this.response.item(contact, new ContactTransformer());
  }

  @Get('self')
  @ApiOperation({
    summary: 'Current user get contacts list with authenticate user',
  })
  @ApiOkResponse({ description: 'Contacts entity' })
  async selfContacts(@AuthenticatedUser() currentUser: User) {
    const contacts = await this.contactService.findWhere({
      where: { userId: currentUser.id },
    });

    if (!contacts) {
      throw new NotFoundException('Contact');
    }

    return this.response.collection(contacts, new ContactTransformer());
  }

  @Get('self/:id')
  @ApiOperation({
    summary: 'Current user get contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Contact entity' })
  async selfContact(
    @AuthenticatedUser() currentUser: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const contact = await this.contactService.findWhere({
      where: { id: id, userId: currentUser.id },
    });

    return this.response.item(contact, new ContactTransformer());
  }

  @Post()
  @ApiOperation({ summary: 'Admin/user create new contact with userId param' })
  @ApiOkResponse({ description: 'New contact entity' })
  async createContact(
    @AuthenticatedUser() currentUser: User,
    @Body() data: CreateContactDto,
  ): Promise<any> {
    if (_.includes(currentUser.roles, 'user')) {
      data.userId = currentUser.id;
    }

    const contact = await this.contactService.create(data);

    return this.response.item(contact, new ContactTransformer());
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Update contact entity' })
  async updateContact(
    @AuthenticatedUser() currentUser: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateContactDto,
  ): Promise<any> {
    if (_.includes(currentUser.roles, 'user')) {
      const existContact = await this.contactService.findWhere({
        where: { id: id, userId: currentUser.id },
      });

      if (!existContact) {
        throw new NotFoundException('Contact not belong to user');
      }
    }

    await this.contactService.update(id, data);

    return this.response.success();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Delete contact successfully' })
  async deleteContact(
    @AuthenticatedUser() currentUser: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    if (_.includes(currentUser.roles, 'user')) {
      const existContact = await this.contactService.findWhere({
        where: { id: id, userId: currentUser.id },
      });

      if (existContact) {
        throw new NotFoundException('Contact not belong to user');
      }
    }

    await this.contactService.destroy(id);

    return this.response.success();
  }
}
