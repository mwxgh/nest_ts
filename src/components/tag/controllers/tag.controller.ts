import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
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

    const data = await this.tag.paginate(queryTag, params);

    return this.response.paginate(data, new TagTransformer());
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
    const oneTag = await this.tag.findOrFail(id);

    return this.response.item(oneTag, new TagTransformer());
  }
}
