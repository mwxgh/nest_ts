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
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { TagAble } from '../../tag/entities/tagAble.entity';
import { CategoryAble } from '../../category/entities/categoryAble.entity';
import * as _ from 'lodash';
import { QueryPaginateDto } from 'src/shared/dto/findManyParams.dto';
@ApiTags('Posts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/admin/posts')
export class AdminPostController {
  constructor(
    private connection: Connection,
    private post: PostService,
    private tagAble: TagAbleService,
    private response: ApiResponseService,
    private image: ImageService,
    private categoryAble: CategoryAbleService,
  ) {}

  @Get('listPaginate')
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };
    const data = await this.post.JoinTable(query);
    await data.getMany();
    const paginate = await this.post.paginate(data, params);
    return this.response.paginate(paginate, new PostTransformer());
  }

  @Get('type')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'include', required: false })
  @ApiQuery({ name: 'type' })
  async indexType(@Query() query: any): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.limit) || 10,
      page: Number(query.page) || 1,
    };
    const data = await this.post.JoinTable(query);
    await data.where('posts.type = :type', { type: query.type }).getMany();
    const paginate = await this.post.paginate(data, params);
    if (!paginate.items.length) throw new NotFoundException('Data');
    return this.response.paginate(paginate, new PostTransformer());
  }

  @Get('list')
  @ApiQuery({ name: 'include', required: false })
  async list(@Query() query: any): Promise<any> {
    const basQuery = await this.post.JoinTable(query);
    const posts = await basQuery.getMany();
    if (!posts) throw new NotFoundException('Data');
    return this.response.collection(posts, new PostTransformer());
  }

  @Get(':id')
  @ApiQuery({ name: 'include', required: false })
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ): Promise<any> {
    const data = await this.post.JoinTable(query);
    const checkData = await data
      .where('posts.id = :id', { id: Number(id) })
      .getOne();
    if (checkData) throw new NotFoundException('Data');
    return this.response.item(checkData, new PostTransformer());
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ): Promise<any> {
    const data_tagAble_current = await getRepository(TagAble)
      .createQueryBuilder('tagAbles')
      .where('tagAbles.tagAbleId = :tagAbleId', { tagAbleId: Number(id) })
      .andWhere('tagAbles.tagAbleType = :tagAbleType', {
        tagAbleType: 'posts',
      })
      .getMany();

    if (!data_tagAble_current) throw new NotFoundException('TagAble');

    const tag_id_search = data_tagAble_current.map(
      (data_tagAble_element: any) => data_tagAble_element.id,
    );

    if (!tag_id_search) throw new NotFoundException('Search tag');

    await this.tagAble.destroyTagAble(tag_id_search);
    const data_tag_put = await getManager()
      .createQueryBuilder(TagName, 'tags')
      .whereInIds(data.tagIds)
      .getMany();

    const data_tags = data_tag_put.map((data_tag_element: any) => ({
      name: data_tag_element.name,
      tag_id: data_tag_element.id,
      tagable_id: Number(id),
      tagable_type: 'posts',
      status: data_tag_element.status,
    }));

    if (!data_tags) throw new NotFoundException('Update data tag');

    await this.tagAble.store(data_tags);
    const data_categoriable_current = await getRepository(CategoryAble)
      .createQueryBuilder('categoryAble')
      .where('categoryAble.categoryAbleId = :categoryAbleId', {
        categoryAbleId: Number(id),
      })
      .andWhere('categoryAble.categoryAbleType = :categoryAbleType', {
        categoryAbleType: 'posts',
      })
      .getMany();

    if (!data_categoriable_current) throw new NotFoundException('CategoryAble');

    const categories_id_search = data_categoriable_current.map(
      (data_category_element: any) => data_category_element.id,
    );

    if (!categories_id_search) throw new NotFoundException('Search categories');

    await this.categoryAble.destroyCategories(categories_id_search);

    const data_categories_put = await getManager()
      .createQueryBuilder(Category, 'categories')
      .whereInIds(data.categoryIds)
      .getMany();

    const data_categories = data_categories_put.map(
      (data_category_element: any) => ({
        categoryId: data_category_element.id,
        categoryAbleId: Number(id),
        categoryAbleType: 'posts',
      }),
    );
    if (!data_categories) throw new NotFoundException('Update data categories');

    await this.categoryAble.store(data_categories);

    const data_post_update = await getRepository(PostAble)
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id: Number(id) })
      .getOne();

    if (!data_post_update) throw new NotFoundException('Update data post');

    const dataChange = _.assign(data, { slug: slugify(data.title) });
    const count_data = {
      title: data.title,
      type: data.type,
      slug: dataChange.slug,
    };

    const count = await getManager()
      .createQueryBuilder(PostAble, 'posts')
      .where(
        'posts.title = :title AND posts.type = :type AND posts.slug = :slug ',
        count_data,
      )
      .getCount();

    if (
      data_post_update.title === data.title &&
      data_post_update.type === data.type
    ) {
      delete dataChange.slug;
    } else if (count) {
      dataChange.slug = `${dataChange.slug}-${count}`;
    }
    delete dataChange.categoryIds;
    delete dataChange.tagIds;
    delete dataChange.url;
    delete dataChange.createdAt;
    await this.post.update(Number(id), dataChange);

    return this.response.success();
  }

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const check_data_tagable = await getRepository(TagAble)
      .createQueryBuilder('tagAbles')
      .where('tagAbles.tagAbleId = :tagAbleId', { tagAbleId: Number(id) })
      .andWhere('tagAbles.tagAbleType = :tagAbleType', {
        tagAbleType: 'posts',
      })
      .getMany();

    if (!check_data_tagable) throw new NotFoundException('TagAble');

    const check_tagable_id_array = check_data_tagable.map(
      (check_data_tagable_element: any) => check_data_tagable_element.id,
    );

    if (!check_tagable_id_array) throw new NotFoundException('Array tagable');

    await this.tagAble.destroyTagAble(check_tagable_id_array);

    const check_data_categoriesable = await getRepository(CategoryAble)
      .createQueryBuilder('categoryAble')
      .where('categoryAble.categoryAbleId= :categoryAbleId', {
        categoryAbleId: Number(id),
      })
      .andWhere('categoryAble.categoryAbleType= :categoryAbleType', {
        categoryAbleType: 'posts',
      })
      .getMany();

    if (!check_data_categoriesable) throw new NotFoundException('Categoriable');

    const check_categoriable_id_array = check_data_categoriesable.map(
      (check_data_categoriesable_element: any) =>
        check_data_categoriesable_element.id,
    );

    if (!check_categoriable_id_array)
      throw new NotFoundException('Array categories');

    await this.categoryAble.destroyCategories(check_categoriable_id_array);

    const check_data_post = await getRepository(PostAble)
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id: Number(id) })
      .getOne();

    if (!check_data_post) throw new NotFoundException('Data update post');
    await this.post.destroyPost(check_data_post.id);
    return this.response.success();
  }

  @Post()
  async store(@Body() data: CreatPostDto): Promise<any> {
    const check_tag = await getManager()
      .createQueryBuilder(TagName, 'tags')
      .whereInIds(data.tagIds)
      .getMany();
    if (!check_tag) return { statusCode: 404, message: 'Tag Name Not Found' };
    const check_category = await getManager()
      .createQueryBuilder(Category, 'categories')
      .whereInIds(data.categoryIds)
      .getMany();
    if (!check_category)
      return { statusCode: 404, message: 'Category Not Found' };
    const count_data = {
      title: data.title,
      type: data.type,
    };
    const count = await getManager()
      .createQueryBuilder(PostAble, 'posts')
      .where('posts.title = :title AND posts.type = :type ', count_data)
      .getCount();

    const dataChange = _.assign(data, { slug: slugify(data.title) });

    if (count) dataChange.slug = `${dataChange.slug}-${count}`;

    const data2 = { ...dataChange };

    delete data.url;

    const create_data = await this.post.store(dataChange);

    const data_tags = check_tag.map((tag: any) => ({
      name: tag.name,
      tagId: tag.id,
      tagAbleId: create_data.id,
      tagableType: 'posts',
      status: tag.status,
    }));
    const data_categories = check_category.map((category: any) => ({
      categoryId: category.id,
      categoryAbleId: create_data.id,
      categoryAbleType: 'posts',
    }));

    await this.tagAble.store(data_tags);
    await this.categoryAble.store(data_categories);

    data2.url.map(async (i) => {
      const data1 = {
        imageAbleType: 'posts',
        url: i['url'],
        isThumbnail: false,
        imageAbleId: create_data.id,
      };
      return await this.image.create(data1);
    });
    return this.response.item(create_data, new PostTransformer());
  }
}
