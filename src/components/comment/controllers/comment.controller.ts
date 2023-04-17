import { Auth } from '@authModule/decorators/auth.decorator'
import { AuthenticatedUser } from '@authModule/decorators/authenticatedUser.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import { CommentEntity } from '@commentModule/entities/comment.entity'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
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
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
} from '@shared/interfaces/response.interface'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { Me } from '@userModule/dto/user.dto'
import { APIDoc } from 'src/components/components.apidoc'
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
  @ApiOperation({ summary: APIDoc.comment.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.comment.create.apiOk })
  async createComment(
    @Body() data: CreateCommentDto,
    @AuthenticatedUser() currentUser: Me,
  ): Promise<CreateResponse> {
    const comment: CommentEntity = await this.comment.createComment({
      currentUser,
      data,
    })

    return this.response.item(comment, new CommentTransformer())
  }

  @Get()
  @ApiOperation({ summary: APIDoc.comment.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.comment.read.apiOk })
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

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.contact.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.contact.detail.apiOk })
  async readComment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const comment = await this.comment.findOneOrFail(id)

    return this.response.item(comment, new CommentTransformer())
  }

  // @Put(':id')
  // @ApiOperation({ summary: APIDoc.contact.update.apiOperation })
  // @ApiOkResponse({ description: APIDoc.contact.update.apiOk })
  // async updateContact(
  //   @AuthenticatedUser() currentUser: Me,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() data: UpdateCommentDto,
  // ): Promise<UpdateResponse> {
  //   const comment: CommentEntity = await this.comment.updateComment({
  //     id,
  //     currentUser,
  //     data,
  //   })

  //   return this.response.item(comment, new CommentTransformer())
  // }
}
