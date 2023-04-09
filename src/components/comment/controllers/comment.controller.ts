import { Auth } from '@authModule/decorators/auth.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { CommentEntity } from '@commentModule/entities/comment.entity'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
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
  GetListPaginationResponse,
  GetListResponse,
} from '@shared/interfaces/response.interface'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { SelectQueryBuilder } from 'typeorm'
import { CreateCommentDto } from '../dto/comment.dto'
import { CommentService } from '../services/comment.service'
import { CommentTransformer } from '../transformers/comment.transformer'

@ApiTags('Comments')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/comment')
export class UserCommentController {
  constructor(
    private comment: CommentService,
    private response: ApiResponseService,
  ) {}

  private entity = 'comment'
  private fields = ['content']

  @Post()
  @Auth('admin', 'user')
  @ApiOperation({ summary: 'User create new category' })
  @ApiOkResponse({ description: 'New comment entity' })
  async createComment(@Body() data: CreateCommentDto): Promise<CreateResponse> {
    const comment = await this.comment.create(data)

    return this.response.item(comment, new CommentTransformer())
  }

  @Get()
  @ApiOperation({ summary: 'Get list comments' })
  @ApiOkResponse({ description: 'List comments with param query' })
  async readComments(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<CommentEntity>, string[]] =
      await this.comment.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.comment.paginationCalculate(queryBuilder, paginateOption),
        new CommentTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CommentTransformer(),
    )
  }
}
