import { Auth } from '@authModule/decorators/auth.decorator'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
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
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import {
  CreateResponse,
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
  UpdateResponse,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { Me } from '@userModule/dto/user.dto'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto'
import { ContactEntity } from '../entities/contact.entity'
import { ContactService } from '../services/contact.service'
import { ContactTransformer } from '../transformers/contact.transformer'

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

  private entity = 'contact'
  private fields = ['email', 'phone', 'address']

  @Post()
  @ApiOperation({ summary: APIDoc.contact.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.create.apiOk })
  async createContact(
    @AuthenticatedUser() currentUser: Me,
    @Body() data: CreateContactDto,
  ): Promise<CreateResponse> {
    const contact: ContactEntity = await this.contactService.createContact({
      currentUser,
      data,
    })

    return this.response.item(contact, new ContactTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.contact.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.read.apiOk })
  async readContacts(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<ContactEntity>, string[]] =
      await this.contactService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.contactService.paginationCalculate(
          queryBuilder,
          paginateOption,
        ),
        new ContactTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ContactTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.contact.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.detail.apiOk })
  async readContact(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const contact = await this.contactService.findOneOrFail(id)

    return this.response.item(contact, new ContactTransformer())
  }

  @Get('self')
  @ApiOperation({ summary: APIDoc.contact.readThemselves.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.readThemselves.apiOk })
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
  @ApiOperation({ summary: APIDoc.contact.detailThemselves.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.detailThemselves.apiOk })
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
  @ApiOperation({ summary: APIDoc.contact.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.update.apiOk })
  async updateContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateContactDto,
  ): Promise<UpdateResponse> {
    const contact: ContactEntity = await this.contactService.findOneOrFail(id)

    this.contactService.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    const updateContact = await this.contactService.update(contact.id, data)

    return this.response.item(updateContact, new ContactTransformer())
  }

  @Delete(':id')
  @ApiOperation({ summary: APIDoc.contact.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.delete.apiOk })
  async deleteContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const contact: ContactEntity = await this.contactService.findOneOrFail(id)

    this.contactService.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    await this.contactService.destroy(id)

    return this.response.success({
      message: this.contactService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
