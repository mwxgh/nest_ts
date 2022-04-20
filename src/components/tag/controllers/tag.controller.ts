import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { TagService } from '../services/tag.service';
import { TagAbleService } from '../services/tagAble.service';
import { TagTransformer } from '../transformers/tag.transformer';
@ApiTags('Tags')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/tag')
export class UserTagController {
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

    const data = await this.tagService.paginate(queryTag, params);

    return this.response.paginate(data, new TagTransformer());
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
}
