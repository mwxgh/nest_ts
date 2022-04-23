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
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Connection, getRepository, getManager } from 'typeorm';
import { PostAble } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { CreatPostDto, UpdatePostDto } from '../dto/post.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { PostTransformer } from '../transformers/post.transformer';
import { ImageService } from 'src/components/image/services/image.service';
import slugify from 'slugify';
import { TagAbleService } from 'src/components/tag/services/tagAble.service';
import { TagName } from 'src/components/tag/entities/tag.entity';
import { Category } from 'src/components/category/entities/category.entity';
import { CategoryAbleService } from 'src/components/category/services/categoryAble.service';
import { TagAble, TagAbleType } from '../../tag/entities/tagAble.entity';
import {
  CategoryAble,
  CategoryAbleType,
} from '../../category/entities/categoryAble.entity';
import * as _ from 'lodash';
import {
  QueryOneDto,
  QueryPostListDto,
  QueryPostPaginateDto,
} from 'src/shared/dto/queryParams.dto';
import { TagService } from 'src/components/tag/services/tag.service';
import { CategoryService } from 'src/components/category/services/category.service';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
@ApiTags('Posts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/admin/posts')
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

  @Get('list')
  async list(@Query() query: QueryPostListDto): Promise<any> {
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

  @Put(':id')
  @Auth('admin')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ): Promise<any> {
    const currentPost = await this.postService.findOrFail(id);

    const currentTagsAble = await getRepository(TagAble)
      .createQueryBuilder('tagAbles')
      .where('tagAbles.tagAbleId = :tagAbleId', { tagAbleId: Number(id) })
      .andWhere('tagAbles.tagAbleType = :tagAbleType', {
        tagAbleType: TagAbleType.post,
      })
      .getMany();

    if (currentTagsAble.length > 0) {
      const currentTagAbleIds = currentTagsAble.map(
        (currentTagAble: any) => currentTagAble.id,
      );

      await this.tagAbleService.destroy(currentTagAbleIds);
    }

    const updateTags = await this.tagService.findIdInOrFail(data.tagIds);
    if (updateTags.length > 0) {
      const tags = updateTags.map((updateTag: any) => ({
        name: updateTag.name,
        tagId: updateTag.id,
        tagAbleId: Number(id),
        tagAbleType: TagAbleType.post,
        status: updateTag.status,
      }));

      await this.tagAbleService.store(tags);
    }

    const currentCategoriesAble = await getRepository(CategoryAble)
      .createQueryBuilder('categoryAble')
      .where('categoryAble.categoryAbleId = :categoryAbleId', {
        categoryAbleId: Number(id),
      })
      .andWhere('categoryAble.categoryAbleType = :categoryAbleType', {
        categoryAbleType: CategoryAbleType.post,
      })
      .getMany();

    if (currentCategoriesAble.length > 0) {
      const currentCategoryAbleIds = currentCategoriesAble.map(
        (currentCategoryAble: any) => currentCategoryAble.id,
      );

      await this.categoryAbleService.destroy(currentCategoryAbleIds);
    }

    const updateCategories = await this.categoryService.findIdInOrFail(
      data.categoryIds,
    );

    if (updateCategories.length > 0) {
      const categories = updateCategories.map((updateCategory: any) => ({
        categoryId: updateCategory.id,
        categoryAbleId: Number(id),
        categoryAbleType: CategoryAbleType.post,
      }));

      await this.categoryAbleService.store(categories);
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
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const currentPost = await this.postService.findOrFail(id);

    await this.postService.destroy(currentPost.id);

    const currentTagAbles = await getRepository(TagAble)
      .createQueryBuilder('tagAbles')
      .where('tagAbles.tagAbleId = :tagAbleId', { tagAbleId: Number(id) })
      .andWhere('tagAbles.tagAbleType = :tagAbleType', {
        tagAbleType: TagAbleType.post,
      })
      .getMany();

    if (currentTagAbles.length > 0) {
      const currentTagAbleIds = currentTagAbles.map(
        (currentTagAble) => currentTagAble.id,
      );

      await this.tagAbleService.destroy(currentTagAbleIds);
    }

    const currentCategoryAbles = await getRepository(CategoryAble)
      .createQueryBuilder('categoryAble')
      .where('categoryAble.categoryAbleId = :categoryAbleId', {
        categoryAbleId: Number(id),
      })
      .andWhere('categoryAble.categoryAbleType = :categoryAbleType', {
        categoryAbleType: CategoryAbleType.post,
      })
      .getMany();

    if (currentCategoryAbles.length > 0) {
      const currentCategoryAbleIds = currentCategoryAbles.map(
        (currentCategoryAble) => currentCategoryAble.id,
      );

      await this.categoryAbleService.destroy(currentCategoryAbleIds);
    }

    return this.response.success();
  }

  @Post()
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
        imageAbleType: 'posts',
        url: i['url'],
        isThumbnail: false,
        imageAbleId: newPost.id,
      };

      return await this.image.create(data1);
    });

    return this.response.item(newPost, new PostTransformer());
  }
}
