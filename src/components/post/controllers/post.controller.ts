import {
  Post,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Connection, getManager } from 'typeorm';
import { PostAble } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { CreatPostDto, UpdatePostDto } from '../dto/post.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { PostTransformer } from '../transformers/post.transformer';
import { ImageService } from 'src/components/image/services/image.service';
import slugify from 'slugify';
import { TagAbleService } from 'src/components/tag/services/tagAble.service';
import { CategoryAbleService } from 'src/components/category/services/categoryAble.service';
import { TagAbleType } from '../../tag/entities/tagAble.entity';
import { CategoryAbleType } from '../../category/entities/categoryAble.entity';
import * as _ from 'lodash';
import {
  QueryOneDto,
  QueryPostListDto,
  QueryPostPaginateDto,
} from 'src/shared/dto/queryParams.dto';
import { TagService } from 'src/components/tag/services/tag.service';
import { CategoryService } from 'src/components/category/services/category.service';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { ImageAbleType } from 'src/components/image/entities/image.entity';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
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
    private tagAbleService: TagAbleService,
    private tagService: TagService,
    private response: ApiResponseService,
    private image: ImageService,
    private categoryService: CategoryService,
    private categoryAbleService: CategoryAbleService,
  ) {}

  private entity = 'posts';
  private fields = ['title', 'summary', 'releaseDate'];

  @Get('listPaginate')
  @ApiOperation({
    summary: 'List posts with query & paginate',
  })
  @ApiOkResponse({
    description: 'List posts with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPostPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const { search, includes, privacy, status, priority, type } = query;

    const baseQuery = await this.postService.queryPost({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      includes,
      privacy,
      status,
      priority,
      type,
    });

    const posts = await baseQuery.getMany();

    const paginate = await this.postService.paginate(posts, params);

    return this.response.paginate(paginate, new PostTransformer());
  }

  @Get('listQuery')
  @ApiOperation({
    summary: 'List posts with query / without paginate',
  })
  @ApiOkResponse({
    description: 'List posts with search & includes & filter',
  })
  async listQuery(@Query() query: QueryPostListDto): Promise<any> {
    const { search, includes, privacy, status, priority, type } = query;

    const baseQuery = await this.postService.queryPost({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      includes,
      privacy,
      status,
      priority,
      type,
    });
    const posts = await baseQuery.getMany();

    return this.response.collection(posts, new PostTransformer());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiOkResponse({ description: 'Post entity' })
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryOneDto,
  ): Promise<any> {
    const { includes } = query;

    const baseQuery = await this.postService.queryPost({
      entity: this.entity,
      includes,
    });

    const post = await baseQuery
      .andWhere('posts.id = :id', { id: Number(id) })
      .getOne();

    if (post) throw new NotFoundException('Data');

    return this.response.item(post, new PostTransformer());
  }

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new post' })
  @ApiOkResponse({ description: 'New post entity' })
  async createPost(@Body() data: CreatPostDto): Promise<any> {
    const tagsAvailable = await this.tagService.findIdInOrFail(data.tagIds);

    const categoriesAvailable = await this.categoryService.findIdInOrFail(
      data.categoryIds,
    );

    const similarPosts = await getManager()
      .createQueryBuilder(PostAble, 'posts')
      .where('posts.title = :title AND posts.type = :type ', {
        title: data.title,
        type: data.type,
      })
      .getCount();

    const dataSlugify = _.assign(data, { slug: slugify(data.title) });

    if (similarPosts) dataSlugify.slug = `${dataSlugify.slug}-${similarPosts}`;

    const newPost = await this.postService.store(dataSlugify);

    const tagAbleData = tagsAvailable.map((tag: any) => ({
      name: tag.name,
      tagId: tag.id,
      tagAbleId: newPost.id,
      tagAbleType: TagAbleType.post,
      status: tag.status,
    }));

    const categoryAbleDate = categoriesAvailable.map((category: any) => ({
      categoryId: category.id,
      categoryAbleId: newPost.id,
      categoryAbleType: CategoryAbleType.post,
    }));

    await this.tagAbleService.store(tagAbleData);

    await this.categoryAbleService.store(categoryAbleDate);

    const data2 = { ...dataSlugify };

    delete data.url;

    data2.url.map(async (i) => {
      const data1 = {
        imageAbleType: ImageAbleType.post,
        url: i['url'],
        isThumbnail: false,
        imageAbleId: newPost.id,
      };

      return await this.image.create(data1);
    });

    return this.response.item(newPost, new PostTransformer());
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update post by id' })
  @ApiOkResponse({ description: 'Update post entity' })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ): Promise<any> {
    const currentPost = await this.postService.findOneOrFail(id);

    const currentTagAbles = await this.tagAbleService.findWhere({
      where: {
        tagAbleId: currentPost.id,
        tagAbleType: TagAbleType.post,
      },
    });

    const currentCategoryAbles = await this.categoryAbleService.findWhere({
      where: {
        categoryAbleId: currentPost.id,
        categoryAbleType: CategoryAbleType.post,
      },
    });

    const currentTagIds = currentTagAbles.map(
      (currentTagAble) => currentTagAble.tagId,
    );

    const currentCategoryIds = currentCategoryAbles.map(
      (currentCategory) => currentCategory.categoryId,
    );

    const detachTagIds = _.difference(currentTagIds, data.tagIds);

    if (detachTagIds.length > 0) {
      const queryTagAble = await this.tagService.queryBuilder({
        entity: 'tagAbles',
      });

      const expireTagAbles = await queryTagAble
        .andWhere('tagAbles.tagId IN (:tagIds)', { tagIds: detachTagIds })
        .getMany();

      for (const expireTagAble of expireTagAbles) {
        await this.tagAbleService.destroy(expireTagAble.id);
      }
    }

    const newAttachTagIds = _.difference(data.tagIds, currentTagIds);

    if (newAttachTagIds.length > 0) {
      const queryTag = await this.tagService.queryBuilder({ entity: 'tags' });

      const newAttachTags = await queryTag
        .andWhere('tags.id IN (:tagIds)', {
          tagIds: newAttachTagIds,
        })
        .getMany();

      const tagAbles = newAttachTags.map((newAttachTag: any) => ({
        name: newAttachTag.name,
        tagId: newAttachTag.id,
        tagAbleId: Number(id),
        tagAbleType: TagAbleType.post,
        status: newAttachTag.status,
      }));

      for (const tagAble of tagAbles) {
        await this.tagAbleService.store(tagAble);
      }
    }

    const detachCategoryIds = _.difference(
      currentCategoryIds,
      data.categoryIds,
    );

    if (detachCategoryIds.length > 0) {
      const queryCategoryAble = await this.categoryAbleService.queryBuilder({
        entity: 'categoryAbles',
      });

      const expireCategoryAbles = await queryCategoryAble
        .andWhere('categoryAbles.categoryAbleId IN (:categoryAbleIds)', {
          categoryAbleIds: detachCategoryIds,
        })
        .getMany();

      for (const expireCategoryAble of expireCategoryAbles) {
        await this.categoryAbleService.destroy(expireCategoryAble.id);
      }
    }

    const newAttachCategoryIds = _.difference(
      data.categoryIds,
      currentCategoryIds,
    );

    if (newAttachCategoryIds.length > 0) {
      const queryCategories = await this.categoryService.queryBuilder({
        entity: 'categories',
      });

      const newAttachCategories = await queryCategories
        .andWhere('categories.id IN (:categoryIds)', {
          categoryIds: newAttachTagIds,
        })
        .getMany();

      const categoryAbles = newAttachCategories.map(
        (newAttachCategory: any) => ({
          name: newAttachCategory.name,
          categoryId: newAttachCategory.id,
          categoryAbleId: Number(id),
          categoryAbleType: CategoryAbleType.post,
          status: newAttachCategory.status,
        }),
      );

      for (const categoryAble of categoryAbles) {
        await this.categoryAbleService.store(categoryAble);
      }
    }

    const dataSlugify = _.assign(data, { slug: slugify(data.title) });

    const count = await getManager()
      .createQueryBuilder(PostAble, 'posts')
      .where(
        'posts.title = :title AND posts.type = :type AND posts.slug = :slug ',
        {
          title: data.title,
          type: data.type,
          slug: dataSlugify.slug,
        },
      )
      .getCount();

    if (currentPost.title === data.title && currentPost.type === data.type) {
      delete dataSlugify.slug;
    } else if (count) {
      dataSlugify.slug = `${dataSlugify.slug}-${count}`;
    }

    delete dataSlugify.url;

    await this.postService.update(Number(id), dataSlugify);

    return this.response.success();
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete post by id' })
  @ApiOkResponse({ description: 'Delete post successfully' })
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const currentPost = await this.postService.findOneOrFail(id);

    await this.postService.destroy(currentPost.id);

    const currentTagAbles = await this.tagAbleService.findWhere({
      where: {
        tagAbleId: currentPost.id,
        tagAbleType: TagAbleType.post,
      },
    });

    if (currentTagAbles.length > 0) {
      const currentTagAbleIds = currentTagAbles.map(
        (currentTagAble) => currentTagAble.id,
      );

      await this.tagAbleService.destroy(currentTagAbleIds);
    }

    const currentCategoryAbles = await this.categoryAbleService.findWhere({
      where: {
        categoryAbleId: currentPost.id,
        categoryAbleType: CategoryAbleType.post,
      },
    });

    if (currentCategoryAbles.length > 0) {
      const currentCategoryAbleIds = currentCategoryAbles.map(
        (currentCategoryAble) => currentCategoryAble.id,
      );

      await this.categoryAbleService.destroy(currentCategoryAbleIds);
    }

    return this.response.success();
  }
}
