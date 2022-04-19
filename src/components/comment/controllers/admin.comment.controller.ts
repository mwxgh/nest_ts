import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { IPaginationOptions } from 'src/shared/services/pagination';

import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
import { CommentAbleType } from '../entities/comment.entity';
import { CommentService } from '../services/comment.service';
import { CommentTransformer } from '../transformers/comment.transformer';

@ApiTags('Comments')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/admin/comments')
export class AdminCommentController {
  constructor(
    private comment: CommentService,
    private response: ApiResponseService,
  ) {}

  @Post()
  async store(@Body() body: CreateCommentDto): Promise<any> {
    const value = Object.values(CommentAbleType);

    const arr = [];

    value.forEach((el) => arr.push(el));

    if (!arr.includes(body.commentAbleType)) throw new NotFoundException();

    const data = await this.comment.create(body);

    return this.response.item(data, new CommentTransformer());
  }

  @Get('listPaginate')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async index(@Query() query: any): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.limit) || 10,
      page: Number(query.page) || 1,
    };
    const data = await this.comment.joinComment();

    await data.getMany();

    const paginate = await this.comment.paginate(data, params);

    return this.response.paginate(paginate, new CommentTransformer());
  }

  @Get('list')
  async list(): Promise<any> {
    const data = await this.comment.joinComment();

    return this.response.collection(
      await data.getMany(),
      new CommentTransformer(),
    );
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<any> {
    if (!Number(id)) throw new NotFoundException();

    const data = await this.comment.joinComment();

    const comment = await data
      .where('comments.id = :id', { id: Number(id) })
      .getMany();

    if (comment) throw new NotFoundException();

    return this.response.collection(comment, new CommentTransformer());
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() body: UpdateCommentDto): Promise<any> {
    await this.comment.findOrFail(params.id);

    await this.comment.update(params.id, body);

    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async destroy(@Param() params): Promise<any> {
    await this.comment.findOrFail(params.id);

    await this.comment.destroy(params.id);

    return this.response.success();
  }
}
