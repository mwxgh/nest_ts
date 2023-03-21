import { Auth } from '@authModule/decorators/auth.decorator'
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
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { QueryManyPostDto, QueryOneDto } from '@shared/dto/queryParams.dto'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { Connection, SelectQueryBuilder } from 'typeorm'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'
import { PostService } from '../services/post.service'
import { PostTransformer } from '../transformers/post.transformer'

import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
import {
  CreateResponse,
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { PrimitiveService } from '@shared/services/primitive.service'
import { PostEntity } from '../entities/post.entity'
@ApiTags('Posts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/posts')
export class PostController {
  constructor(
    private connection: Connection,
    private postService: PostService,
    private response: ApiResponseService,
    private primitiveService: PrimitiveService,
  ) {}

  private entity = 'post'
  private fields = ['title', 'summary', 'releaseDate']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new post' })
  @ApiOkResponse({ description: 'New post entity' })
  async createPost(@Body() data: CreatePostDto): Promise<CreateResponse> {
    const post = await this.postService.savePost(data)

    return this.response.item(post, new PostTransformer())
  }

  @Get()
  @ApiOperation({ summary: 'Get list posts' })
  @ApiOkResponse({ description: 'List posts with query param' })
  async readPosts(
    @Query() query: QueryManyPostDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const {
      search,
      sortBy,
      sortType,
      includes,
      privacy,
      status,
      priority,
      type,
    } = query

    const queryBuilder: SelectQueryBuilder<PostEntity> =
      await this.postService.queryPost({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        includes,
        sortBy,
        sortType,
        privacy,
        status,
        priority,
        type,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const posts = await this.postService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(posts, new PostTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new PostTransformer(),
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiOkResponse({ description: 'Post entity' })
  async readPost(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryOneDto,
  ): Promise<GetItemResponse> {
    const { includes } = query

    const post = await this.postService.findOneOrFail(id, {
      relations: includes,
    })

    return this.response.item(post, new PostTransformer(includes))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update post by id' })
  @ApiOkResponse({ description: 'Update post entity' })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ): Promise<SuccessfullyOperation> {
    await this.postService.updatePost({ id, data })

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: [this.entity],
      }),
    })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete post by id' })
  @ApiOkResponse({ description: 'Delete post successfully' })
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.postService.deletePost(id)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
