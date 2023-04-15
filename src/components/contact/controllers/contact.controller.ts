import { Auth } from '@authModule/decorators/auth.decorator'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
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
    private contact: ContactService,
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
    const contact: ContactEntity = await this.contact.createContact({
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
      await this.contact.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.contact.paginationCalculate(queryBuilder, paginateOption),
        new ContactTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ContactTransformer(),
    )
  }

  @Get('self')
  @ApiOperation({ summary: APIDoc.contact.readThemselves.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.readThemselves.apiOk })
  async readSelfContacts(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetListResponse> {
    const contacts: ContactEntity[] = await this.contact.findWhere({
      userId: currentUser.id,
    })

    return this.response.collection(contacts, new ContactTransformer())
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.contact.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.detail.apiOk })
  async readContact(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const contact = await this.contact.findOneOrFail(id)

    return this.response.item(contact, new ContactTransformer())
  }

  @Get('self/:id')
  @ApiOperation({ summary: APIDoc.contact.detailThemselves.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.detailThemselves.apiOk })
  async selfContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const contact: ContactEntity = await this.contact.getSelfDetailContact({
      id,
      currentUser,
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
    const contact: ContactEntity = await this.contact.updateContact({
      id,
      currentUser,
      data,
    })

    return this.response.item(contact, new ContactTransformer())
  }

  @Delete(':id')
  @ApiOperation({ summary: APIDoc.contact.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.delete.apiOk })
  async deleteContact(
    @AuthenticatedUser() currentUser: Me,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.contact.deleteContact({ id, currentUser })

    return this.response.success({
      message: this.contact.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
