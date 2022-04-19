import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
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
    private tag: TagService,
    private tagAble: TagAbleService,
    private response: ApiResponseService,
  ) {}

  @Get('listPaginate')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async index(@Query() query: any): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.limit) || 10,
      page: Number(query.page) || 1,
    };
    const queryTag = await this.tag.queryTag();
    const pages = await this.tag.paginate(queryTag, params);
    return this.response.paginate(pages, new TagTransformer());
  }

  @Get('list')
  async list(): Promise<any> {
    const queryTag = await this.tag.queryTag();
    return this.response.collection(
      await queryTag.getMany(),
      new TagTransformer(),
    );
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<any> {
    const queryTag = await this.tag.queryTag();

    const oneTag = await queryTag
      .where('tags.id = :id', { id: Number(id) })
      .getOne();

    return this.response.item(oneTag, new TagTransformer());
  }

  @Post()
  async store(@Body() data: CreateTagDto): Promise<any> {
    const newTag = await this.tag.create(data);

    return this.response.item(newTag, new TagTransformer());
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTagDto,
  ): Promise<any> {
    await this.tag.findOrFail(id);

    await this.tag.update(id, { ...data, updatedAt: new Date() });

    return this.response.success();
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<any> {
    await this.tag.findOrFail(id);

    await this.tag.destroy(id);

    return this.response.success();
  }
}
