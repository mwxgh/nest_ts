import { Auth } from '@authModule/decorators/auth.decorator'
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
import { TagEntity } from '@tagModule/entities/tag.entity'
import { APIDoc } from 'src/components/components.apidoc'
import { SelectQueryBuilder } from 'typeorm'
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto'
import { TagService } from '../services/tag.service'
import { TagTransformer } from '../transformers/tag.transformer'

@ApiTags('Tags')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tags')
export class TagController {
  constructor(private tag: TagService, private response: ApiResponseService) {}

  private entity = 'tag'
  private fields = ['name']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.tag.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.tag.create.apiOk })
  async createTag(@Body() data: CreateTagDto): Promise<CreateResponse> {
    const tag = await this.tag.createTag(data)

    return this.response.item(tag, new TagTransformer())
  }

  @Get()
  @ApiOperation({ summary: APIDoc.tag.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.tag.read.apiOk })
  async readTags(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<TagEntity>, string[]] =
      await this.tag.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.tag.paginationCalculate(queryBuilder, paginateOption),
        new TagTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new TagTransformer(),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: APIDoc.tag.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.tag.detail.apiOk })
  async readTag(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const tag = await this.tag.findOneOrFail(id)

    return this.response.item(tag, new TagTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.tag.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.tag.update.apiOk })
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTagDto,
  ): Promise<UpdateResponse> {
    await this.tag.checkExisting({ where: { id } })

    const tag: TagEntity = await this.tag.update(id, body)

    return this.response.item(tag, new TagTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.tag.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.tag.delete.apiOk })
  async deleteTag(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.tag.deleteTag(id)

    return this.response.success({
      message: this.tag.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
