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
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
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
@Controller('api/tag')
export class TagController {
  constructor(
    private tagService: TagService,
    private tagAbleService: TagAbleService,
    private response: ApiResponseService,
  ) {}

  private entity = 'tags';
  private fields = ['name'];

  @Get('listPaginate')
  @ApiOperation({
    summary: 'List tags with query & paginate',
  })
  @ApiOkResponse({
    description: 'List tag with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const keyword = query.search;

    const queryTag = await this.tagService.queryTag(
      this.entity,
      this.fields,
      keyword,
    );

    const data = await this.tagService.paginate(queryTag, params);

    return this.response.paginate(data, new TagTransformer());
  }

  @Get('listQuery')
  @ApiOperation({ summary: 'List tags with query / without paginate' })
  @ApiOkResponse({
    description: 'List tags with search & includes & filter',
  })
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const keyword = query.search;

    const queryTag = await this.tagService.queryTag(
      this.entity,
      this.fields,
      keyword,
    );

    return this.response.collection(
      await queryTag.getMany(),
      new TagTransformer(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiOkResponse({ description: 'Tag entity' })
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const oneTag = (await this.tagService.queryTag(this.entity))
      .andWhere('tags.id = :id', { id: Number(id) })
      .getOne();

    return this.response.item(oneTag, new TagTransformer());
  }

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new tag' })
  @ApiOkResponse({ description: 'New tag entity' })
  async createTag(@Body() data: CreateTagDto): Promise<any> {
    const newTag = await this.tagService.create(data);

    return this.response.item(newTag, new TagTransformer());
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update tag by id' })
  @ApiOkResponse({ description: 'Update tag entity' })
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTagDto,
  ): Promise<any> {
    await this.tagService.findOrFail(id);

    await this.tagService.update(id, { ...data, updatedAt: new Date() });

    return this.response.success();
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete tag by id' })
  @ApiOkResponse({ description: 'Delete tag successfully' })
  async deleteTag(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.tagService.findOrFail(id);

    await this.tagService.destroy(id);

    return this.response.success();
  }
}
