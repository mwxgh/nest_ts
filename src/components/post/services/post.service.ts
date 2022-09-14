import { Injectable } from '@nestjs/common';
import { assign, difference } from 'lodash';
import slugify from 'slugify';
import {
  CategoryAbleEntity,
  CategoryAbleType,
} from 'src/components/category/entities/categoryAble.entity';
import { CategoryService } from 'src/components/category/services/category.service';
import { CategoryAbleService } from 'src/components/category/services/categoryAble.service';
import { ImageAbleType } from 'src/components/image/entities/imageAble.entity';
import { ImageService } from 'src/components/image/services/image.service';
import { ImageAbleService } from 'src/components/image/services/imageAble.service';
import { TagEntity } from 'src/components/tag/entities/tag.entity';
import {
  TagAbleEntity,
  TagAbleType,
} from 'src/components/tag/entities/tagAble.entity';
import { TagService } from 'src/components/tag/services/tag.service';
import { TagAbleService } from 'src/components/tag/services/tagAble.service';
import { BaseService } from 'src/shared/services/base.service';
import { Repository, Connection, SelectQueryBuilder } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { JoinPostAbleType, PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService extends BaseService {
  public repository: Repository<any>;
  public entity: any = PostEntity;

  constructor(
    private dataSource: Connection,
    private tagService: TagService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private tagAbleService: TagAbleService,
    private categoryAbleService: CategoryAbleService,
    private imageAbleService: ImageAbleService,
  ) {
    super();
    this.repository = this.dataSource.getCustomRepository(PostRepository);
  }

  async queryPost(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    includes?: any;
    sortBy?: string;
    sortType?: 'ASC' | 'DESC';
    privacy?: string;
    status?: string;
    priority?: string;
    type?: string;
  }): Promise<SelectQueryBuilder<PostEntity>> {
    const {
      entity,
      fields,
      keyword,
      includes,
      sortBy,
      sortType,
      privacy,
      status,
      priority,
      type,
    } = params;

    let baseQuery: SelectQueryBuilder<PostEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    });

    if (privacy && privacy !== '') {
      baseQuery = baseQuery.andWhere('posts.privacy = :privacy', {
        privacy,
      });
    }

    if (status && status !== '') {
      baseQuery = baseQuery.andWhere('posts.status = :status', {
        status,
      });
    }

    if (priority && priority !== '') {
      baseQuery = baseQuery.andWhere('posts.priority = :priority', {
        priority,
      });
    }

    if (type && type !== '') {
      baseQuery = baseQuery.andWhere('posts.type = :type', {
        type,
      });
    }

    const keys = Object.keys(JoinPostAbleType);

    const values = Object.values(JoinPostAbleType);

    const value = [];

    let include = [];

    if (includes) {
      const arr = includes.split(',');

      include = [...arr];

      arr.forEach((el) => {
        if (keys.includes(el)) value.push(values[`${keys.indexOf(el)}`]);
      });
      const key = arr.filter((item) => keys.includes(item));

      for (let i = 0; i < key.length; i++) {
        baseQuery = baseQuery.leftJoinAndSelect(`${value[i]}`, `${key[i]}`);
      }

      // query category detail
      if (include.includes('categories'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `categories.category`,
          `category`,
          'categories.categoryAbleType = :categoryAbleType',
          { categoryAbleType: CategoryAbleType.post },
        );

      // query tag detail
      if (include.includes('tags'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `tags.tag`,
          `tag`,
          'tags.tagAbleType = :tagAbleType',
          {
            tagAbleType: TagAbleType.post,
          },
        );
    }
    return baseQuery;
  }

  async savePost(params: { data: CreatePostDto }): Promise<void> {
    const { data } = params;

    const tagsAvailable = await this.tagService.findIdInOrFail(data.tagIds);

    const categoriesAvailable = await this.categoryService.findIdInOrFail(
      data.categoryIds,
    );

    const imagesAvailable = await this.imageService.findIdInOrFail(
      data.imageIds,
    );

    const countPosts = await this.count({
      where: { title: data.title, type: data.type },
    });

    const dataSlugify = assign(data, { slug: slugify(data.title) });

    if (countPosts) dataSlugify.slug = `${dataSlugify.slug}-${countPosts}`;

    const newPost = await this.create(dataSlugify);

    // tagAble
    const tagsAbleData = tagsAvailable.map((tag: any) => ({
      tagId: tag.id,
      tagAbleId: newPost.id,
      tagAbleType: TagAbleType.post,
    }));
    await this.tagAbleService.attachTagAble(...tagsAbleData);

    // categoryAble
    const categoryAbleData = categoriesAvailable.map((category: any) => ({
      categoryId: category.id,
      categoryAbleId: newPost.id,
      categoryAbleType: CategoryAbleType.post,
    }));
    await this.categoryAbleService.save(categoryAbleData);

    // imageAble
    const imageAbleData = imagesAvailable.map((image: any) => ({
      imageId: image.id,
      imageAbleId: newPost.id,
      imageAbleType: ImageAbleType.post,
    }));
    await this.imageAbleService.save(imageAbleData);
  }

  async updatePost(params: { id: number; data: UpdatePostDto }): Promise<void> {
    const { id, data } = params;

    const currentPost = await this.findOneOrFail(id);

    const currentTagAbles: TagAbleEntity[] =
      await this.tagAbleService.findWhere({
        where: {
          tagAbleId: currentPost.id,
          tagAbleType: TagAbleType.post,
        },
      });

    const currentCategoryAbles: CategoryAbleEntity[] =
      await this.categoryAbleService.findWhere({
        where: {
          categoryAbleId: currentPost.id,
          categoryAbleType: CategoryAbleType.post,
        },
      });

    const currentTagIds: number[] = currentTagAbles.map(
      (currentTagAble) => currentTagAble.tagId,
    );

    const currentCategoryIds: number[] = currentCategoryAbles.map(
      (currentCategory) => currentCategory.categoryId,
    );

    const detachTagIds: number[] = difference(currentTagIds, data.tagIds);

    if (detachTagIds.length > 0) {
      detachTagIds.forEach(async (tagAbleId: number) => {
        await this.tagAbleService.detachTagAble({
          tagAbleId,
          tagAbleType: TagAbleType.post,
        });
      });
    }

    const newAttachTagIds: number[] = difference(data.tagIds, currentTagIds);

    await this.tagService.findIdInOrFail(newAttachTagIds);

    const tagsAbleData = newAttachTagIds.map((tagId: number) => ({
      tagId,
      tagAbleId: id,
      tagAbleType: TagAbleType.post,
    }));
    await this.tagAbleService.attachTagAble(...tagsAbleData);

    const detachCategoryIds = difference(currentCategoryIds, data.categoryIds);

    if (detachCategoryIds.length > 0) {
      const queryCategoryAble: SelectQueryBuilder<CategoryAbleEntity> =
        await this.categoryAbleService.queryBuilder({
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

    const newAttachCategoryIds = difference(
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
          categoryId: newAttachCategory.id,
          categoryAbleId: Number(id),
          categoryAbleType: CategoryAbleType.post,
        }),
      );

      for (const categoryAble of categoryAbles) {
        await this.categoryAbleService.save(categoryAble);
      }
    }

    const dataSlugify = assign(data, { slug: slugify(data.title) });

    const count = await this.count({
      where: {
        title: data.title,
        type: data.type,
        slug: dataSlugify.slug,
      },
    });

    if (currentPost.title === data.title && currentPost.type === data.type) {
      delete dataSlugify.slug;
    } else if (count) {
      dataSlugify.slug = `${dataSlugify.slug}-${count}`;
    }

    await this.update(Number(id), dataSlugify);
  }

  async deletePost(params: { id: number }): Promise<void> {
    const { id } = params;

    const currentPost = await this.findOneOrFail(id);

    await this.tagAbleService.detachTagAble({
      tagAbleId: id,
      tagAbleType: TagAbleType.post,
    });

    const currentCategoryAbles: CategoryAbleEntity[] =
      await this.categoryAbleService.findWhere({
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

    await this.destroy(currentPost.id);
  }
}
