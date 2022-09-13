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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
import { QueryManyDto } from 'src/shared/dto/queryParams.dto';
import Messages from 'src/shared/message/message';
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from 'src/shared/services/apiResponse/apiResponse.interface';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { CommonService } from 'src/shared/services/common.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';
import { TagService } from '../services/tag.service';
import { TagAbleService } from '../services/tagAble.service';
import { TagTransformer } from '../transformers/tag.transformer';

@ApiTags('Tags')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tags')
export class TagController {
  constructor(
    private tagService: TagService,
    private tagAbleService: TagAbleService,
    private response: ApiResponseService,
    private commonService: CommonService,
  ) {}

  private entity = 'tags';
  private fields = ['name'];

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new tag' })
  @ApiOkResponse({ description: 'New tag entity' })
  async createTag(@Body() data: CreateTagDto): Promise<SuccessfullyOperation> {
    await this.tagService.checkExisting({
      where: {
        name: data.name,
      },
    });

    await this.tagService.save(data);

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    });
  }

  @Get()
  @ApiOperation({ summary: 'List tags' })
  @ApiOkResponse({ description: 'List tag with query param' })
  async readTags(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, sortBy, sortType } = query;

    const queryBuilder = await this.tagService.queryTag({
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

      const tags = await this.tagService.paginate(queryBuilder, paginateOption);

      return this.response.paginate(tags, new TagTransformer());
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new TagTransformer(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiOkResponse({ description: 'Tag entity' })
  async readTag(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const tag = await this.tagService.findOneOrFail(id);

    return this.response.item(tag, new TagTransformer());
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update tag by id' })
  @ApiOkResponse({ description: 'Update tag entity' })
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTagDto,
  ): Promise<SuccessfullyOperation> {
    await this.tagService.findOneOrFail(id);

    await this.tagService.update(id, { ...data, updatedAt: new Date() });

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: [this.entity],
      }),
    });
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete tag by id' })
  @ApiOkResponse({ description: 'Delete tag successfully' })
  async deleteTag(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.tagService.findOneOrFail(id);

    await this.tagService.destroy(id);

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    });
  }
}
