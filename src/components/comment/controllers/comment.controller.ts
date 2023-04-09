import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import {
  CreateResponse,
  GetListPaginationResponse,
  GetListResponse,
} from '@shared/interfaces/response.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { CreateCommentDto } from '../dto/comment.dto'
import { CommentService } from '../services/comment.service'
import { CommentTransformer } from '../transformers/comment.transformer'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { Auth } from '@authModule/decorators/auth.decorator'
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { CommentEntity } from '@commentModule/entities/comment.entity'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'

@ApiTags('Comments')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/comment')
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

      const data = await this.comment.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(data, new CommentTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new CommentTransformer(),
    )
  }
}
