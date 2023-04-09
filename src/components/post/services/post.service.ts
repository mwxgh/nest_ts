import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'

import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { Injectable } from '@nestjs/common'
import { QueryParams } from '@shared/interfaces/request.interface'
import { BaseService } from '@sharedServices/base.service'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { assign } from 'lodash'
import slugify from 'slugify'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'
import { PostEntity } from '../entities/post.entity'
import { PostRepository } from '../repositories/post.repository'
import { Entity } from '@shared/interfaces/response.interface'
import { AbleType } from '@shared/entities/base.entity'
import { TagEntity } from '@tagModule/entities/tag.entity'
import { CategoryEntity } from '@categoryModule/entities/category.entity'

@Injectable()
export class PostService extends BaseService {
  public repository: Repository<PostEntity>
  public entity: Entity = PostEntity

  constructor(
    private connection: Connection,
    private tagService: TagService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private tagAbleService: TagAbleService,
    private categoryAbleService: CategoryAbleService,
    private imageAbleService: ImageAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(PostRepository)
  }

  async queryPost(
    params: QueryParams & {
      privacy?: string
      status?: string
      priority?: string
      type?: string
    },
  ): Promise<SelectQueryBuilder<PostEntity>> {
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
    } = params

    let [baseQuery]: [SelectQueryBuilder<PostEntity>, string[]] =
      await this.queryBuilder({
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      })

    if (privacy && privacy !== '') {
      baseQuery = baseQuery.andWhere(`${entity}.privacy = :privacy`, {
        privacy,
      })
    }

    if (status && status !== '') {
      baseQuery = baseQuery.andWhere(`.status = :status`, {
        status,
      })
    }

    if (priority && priority !== '') {
      baseQuery = baseQuery.andWhere(`${entity}.priority = :priority`, {
        priority,
      })
    }

    if (type && type !== '') {
      baseQuery = baseQuery.andWhere(`${entity}.type = :type`, {
        type,
      })
    }

    if (includes && includes.length > 0) {
      // query category detail
      if (includes.includes('categories'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.categories`,
          `categories`,
          'categories.ableType = :ableType',
          { ableType: AbleType.post },
        )

      // query tag detail
      if (includes.includes('tags'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.tags`,
          `tags`,
          'tags.ableType = :ableType',
          {
            ableType: AbleType.post,
          },
        )
    }
    return baseQuery
  }

  /**
   * Save post and attach foreign key
   * @param params.data CreatePostDto
   */
  async savePost(data: CreatePostDto): Promise<PostEntity> {
    const tagsAvailable: TagEntity[] = await this.tagService.findIdInOrFail(
      data.tagIds,
    )

    const categoriesAvailable: CategoryEntity[] =
      await this.categoryService.findIdInOrFail(data.categoryIds)

    const imagesAvailable = await this.imageService.findIdInOrFail(
      data.imageIds,
    )
    const countPosts = await this.count({
      where: { title: data.title, type: data.type },
    })

    const dataToSave = assign(data, { slug: slugify(data.title) })

    if (countPosts) dataToSave.slug = `${dataToSave.slug}-${countPosts}`

    const newPost: PostEntity = await this.create(dataToSave)

    // tagAble
    const tagsAbleData = tagsAvailable.map((tag: TagEntity) => ({
      tagId: tag.id,
      ableId: newPost.id,
      ableType: AbleType.post,
    }))
    await this.tagAbleService.attachTagAble(tagsAbleData)

    // categoryAble
    const categoryAbleData = categoriesAvailable.map(
      (category: CategoryEntity) => ({
        categoryId: category.id,
        ableId: newPost.id,
        ableType: AbleType.post,
      }),
    )
    await this.categoryAbleService.attachCategoryAble(categoryAbleData)

    // imageAble
    const imageAbleData = imagesAvailable.map((image: any) => ({
      imageId: image.id,
      ableId: newPost.id,
      ableType: AbleType.post,
    }))
    await this.imageAbleService.attachImageAble(imageAbleData)

    //return category tag image
    return newPost
  }

  /**
   * Update post and update relation foreign key
   * @param params.id
   * @param params.data UpdatePostDto
   */
  async updatePost(params: { id: number; data: UpdatePostDto }): Promise<void> {
    const { id, data } = params

    const currentPost: PostEntity = await this.findOneOrFail(id)

    // imageAble
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageAbleService.updateRelationImageAble({
        ableId: currentPost.id,
        ableType: AbleType.post,
        imageIds: data.imageIds,
      })
    }

    // tagAble
    if (data.tagIds && data.tagIds.length > 0) {
      await this.tagAbleService.updateRelationTagAble({
        ableId: currentPost.id,
        ableType: AbleType.post,
        tagIds: data.tagIds,
      })
    }

    // categoryAble
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.categoryAbleService.updateRelationCategoryAble({
        ableId: currentPost.id,
        ableType: AbleType.post,
        categoryIds: data.categoryIds,
      })
    }

    // update post
    const slug = await this.generateSlug(data.title)
    const dataWithSlug = assign(data, { slug })

    const count = await this.count({
      where: {
        title: data.title,
        type: data.type,
        slug: dataWithSlug.slug,
      },
    })

    if (currentPost.title === data.title && currentPost.type === data.type) {
      delete dataWithSlug.slug
    } else if (count) {
      dataWithSlug.slug = `${dataWithSlug.slug}-${count}`
    }

    await this.update(id, dataWithSlug)
  }

  /**
   * Delete post and detach foreign key
   * @param params.id
   */
  async deletePost(id: number): Promise<void> {
    const currentPost: PostEntity = await this.findOneOrFail(id)

    await this.tagAbleService.detachTagAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.categoryAbleService.detachCategoryAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.imageAbleService.detachImageAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.destroy(currentPost.id)
  }
}
