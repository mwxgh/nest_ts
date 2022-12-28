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
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Auth } from '@authModule/decorators/auth.decorator'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { IPaginationOptions } from '@sharedServices/pagination'
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto'
import { ContactService } from '../services/contact.service'
import { ContactTransformer } from '../transformers/contact.transformer'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from '@sharedServices/apiResponse/apiResponse.interface'
import { CommonService } from '@sharedServices/common.service'
import Messages from '@shared/message/message'
import { ContactEntity } from '../entities/contact.entity'
import { SelectQueryBuilder } from 'typeorm'
import { Me } from '@userModule/dto/user.dto'

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

  private entity = 'contact'

  private fields = ['email', 'phone', 'address']

  @Post()
  @ApiOperation({ summary: 'Admin/user create new contact with userId param' })
  @ApiOkResponse({ description: 'New contact entity' })
  async createContact(
    @AuthenticatedUser() currentUser: Me,
    @Body() data: CreateContactDto,
  ): Promise<SuccessfullyOperation> {
    this.commonService.checkUserPermissionOperation({
      currentUser,
      userId: data.userId,
    })

    await this.contactService.create(data)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    })
  }

  @Get()
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin get list contacts',
  })
  @ApiOkResponse({
    description: 'List contacts with param query',
  })
  async readContacts(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<ContactEntity> =
      await this.contactService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        sortBy,
        sortType,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const contacts = await this.contactService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(contacts, new ContactTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ContactTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get contact by id' })
  @ApiOkResponse({ description: 'Contact entity' })
  async readContact(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const contact = await this.contactService.findOneOrFail(id)

    return this.response.item(contact, new ContactTransformer())
  }

  @Get('self')
  @ApiOperation({
    summary: 'Current user get contacts list with authenticate user',
  })
  @ApiOkResponse({ description: 'Contacts entity' })
  async readSelfContacts(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetListResponse> {
    const contacts: ContactEntity[] = await this.contactService.findWhere({
      userId: currentUser.id,
    })

    if (!contacts) {
      throw new NotFoundException('Contact')
    }

    return this.response.collection(contacts, new ContactTransformer())
  }

  @Get('self/:id')
  @ApiOperation({
    summary: 'Current user get contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Contact entity' })
  async selfContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const contact = await this.contactService.findWhere({
      id,
      userId: currentUser.id,
    })

    return this.response.item(contact, new ContactTransformer())
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Update contact entity' })
  async updateContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateContactDto,
  ): Promise<SuccessfullyOperation> {
    const contact = await this.contactService.findOneOrFail(id)

    this.commonService.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    await this.contactService.update(contact.id, data)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: [this.entity],
      }),
    })
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete contact by id with authenticate user',
  })
  @ApiOkResponse({ description: 'Delete contact successfully' })
  async deleteContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const contact = await this.contactService.findOneOrFail(id)

    this.commonService.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    await this.contactService.destroy(id)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
