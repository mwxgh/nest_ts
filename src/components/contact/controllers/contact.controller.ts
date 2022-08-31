import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { QueryManyDto } from 'src/shared/dto/queryParams.dto';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { ContactService } from '../services/contact.service';
import { ContactTransformer } from '../transformers/contact.transformer';
import { includes, map } from 'lodash';
import { SuccessfullyOperation } from 'src/shared/services/apiResponse/apiResponse.interface';
import { CommonService } from 'src/shared/services/common.service';

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
    private commonService: CommonService,
  ) {}

  private entity = 'contacts';

  private fields = ['email', 'phone', 'address'];

  @Post()
  @ApiOperation({ summary: 'Admin/user create new contact with userId param' })
  @ApiOkResponse({ description: 'New contact entity' })
  async createContact(
    @AuthenticatedUser() currentUser: User,
    @Body() data: CreateContactDto,
  ): Promise<any> {
    this.commonService.checkUserPermissionOperation({
      currentUser,
      userId: data.userId,
    });

    const contact = await this.contactService.create(data);

    return this.response.item(contact, new ContactTransformer());
  }

  @Get()
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin get list contacts',
  })
  @ApiOkResponse({
    description: 'List contacts with param query',
  })
  async readContacts(@Query() query: QueryManyDto): Promise<any> {
    const { search, sortBy, sortType } = query;

    const queryBuilder = await this.contactService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    });

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      };

      const contacts = await this.contactService.paginate(
        queryBuilder,
        paginateOption,
      );

      return this.response.paginate(contacts, new ContactTransformer());
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ContactTransformer(),
    );
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get contact by id' })
  @ApiOkResponse({ description: 'Contact entity' })
  async readContact(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const contact = await this.contactService.findOneOrFail(id);

    return this.response.item(contact, new ContactTransformer());
  }

  @Get('self')
  @ApiOperation({
    summary: 'Current user get contacts list with authenticate user',
  })
  @ApiOkResponse({ description: 'Contacts entity' })
  async readSelfContacts(@AuthenticatedUser() currentUser: User) {
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
    const userRoles = currentUser.roles.map((role) => role.slug);

    if (includes(userRoles, 'user') && userRoles.length == 1) {
      if (currentUser.id !== data.userId) {
        throw new ForbiddenException("Can' update contact for another");
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
  ): Promise<SuccessfullyOperation> {
    const userRoles = map(currentUser.roles, (r) => r.slug);

    if (includes(userRoles, 'user') && userRoles.length == 1) {
      if (currentUser.id !== id) {
        throw new ForbiddenException("Can' delete another's contact");
      }
    }

    await this.contactService.destroy(id);

    return this.response.success({ message: 'Delete contact successfully' });
  }
}
