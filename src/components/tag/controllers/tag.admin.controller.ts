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
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
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
@Controller('api/admin/tag')
export class AdminTagController {
  constructor(
    private tagService: TagService,
    private tagAbleService: TagAbleService,
    private response: ApiResponseService,
  ) {}

  private entity = 'tags';

  @Get('listPaginate')
  async index(
    @Query() query: { perPage: number; page: number; search: string },
  ): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const queryTag = await this.tagService.queryTag(this.entity);

    const pages = await this.tagService.paginate(queryTag, params);

    return this.response.paginate(pages, new TagTransformer());
  }

  @Get('list')
  async list(): Promise<any> {
    const queryTag = await this.tagService.queryTag(this.entity);

    return this.response.collection(
      await queryTag.getMany(),
      new TagTransformer(),
    );
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<any> {
    const oneTag = (await this.tagService.queryTag(this.entity))
      .andWhere('tags.id = :id', { id: Number(id) })
      .getOne();

    return this.response.item(oneTag, new TagTransformer());
  }

  @Post()
  async store(@Body() data: CreateTagDto): Promise<any> {
    const newTag = await this.tagService.create(data);

    return this.response.item(newTag, new TagTransformer());
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTagDto,
  ): Promise<any> {
    await this.tagService.findOrFail(id);

    await this.tagService.update(id, { ...data, updatedAt: new Date() });

    return this.response.success();
  }

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.tagService.findOrFail(id);

    await this.tagService.destroy(id);

    return this.response.success();
  }
}
