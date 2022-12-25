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
} from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { QueryManyDto } from 'src/shared/dto/queryParams.dto'
import Messages from 'src/shared/message/message'
import { SuccessfullyOperation } from 'src/shared/services/apiResponse/apiResponse.interface'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { CommonService } from 'src/shared/services/common.service'

import { IPaginationOptions } from 'src/shared/services/pagination'

import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto'
import { CommentAbleType } from '../entities/comment.entity'
import { CommentService } from '../services/comment.service'
import { CommentTransformer } from '../transformers/comment.transformer'

@ApiTags('Comments')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/admin/comments')
export class AdminCommentController {
  constructor(
    private commentService: CommentService,
    private response: ApiResponseService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Admin/user create new comment with userId param' })
  @ApiOkResponse({ description: 'New comment entity' })
  async createComment(
    @Body() body: CreateCommentDto,
  ): Promise<SuccessfullyOperation> {
    const value = Object.values(CommentAbleType)

    const arr = []

    value.forEach((el) => arr.push(el))

    if (!arr.includes(body.commentAbleType)) throw new NotFoundException()

    await this.commentService.create(body)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: ['comment'],
      }),
    })
  }

  @Get()
  async readComments(@Query() query: QueryManyDto): Promise<any> {
    const queryBuilder = await this.commentService.joinComment()

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const contacts = await this.commentService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(contacts, new CommentTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CommentTransformer(),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin get comment by id' })
  @ApiOkResponse({ description: 'Comment entity' })
  async readComment(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const queryBuilder = await this.commentService.joinComment()

    const comment = await queryBuilder
      .where('comments.id = :id', { id: Number(id) })
      .getMany()

    if (comment) throw new NotFoundException()

    return this.response.collection(comment, new CommentTransformer())
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCommentDto,
  ): Promise<SuccessfullyOperation> {
    await this.commentService.findOneOrFail(id)

    await this.commentService.update(id, body)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: ['comment'],
      }),
    })
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async destroy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.commentService.findOneOrFail(id)

    await this.commentService.destroy(id)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['comment'],
      }),
    })
  }
}
