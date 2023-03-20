import { CategoryAbleType } from '@categoryModule/entities/categoryAble.entity'
import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageAbleType } from '@imageModule/entities/imageAble.entity'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { Injectable } from '@nestjs/common'
import { QueryParams } from '@shared/interfaces/request.interface'
import { BaseService } from '@sharedServices/base.service'
import { TagAbleType } from '@tagModule/entities/tagAble.entity'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { assign } from 'lodash'
import slugify from 'slugify'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'
import { JoinPostAbleType, PostEntity } from '../entities/post.entity'
import { PostRepository } from '../repositories/post.repository'
import { Entity } from '@shared/interfaces/response.interface'

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
      // update include -> string[] in future
      includes?: any
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

    let baseQuery: SelectQueryBuilder<PostEntity> = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    })

    if (privacy && privacy !== '') {
      baseQuery = baseQuery.andWhere('posts.privacy = :privacy', {
        privacy,
      })
    }

    if (status && status !== '') {
      baseQuery = baseQuery.andWhere('posts.status = :status', {
        status,
      })
    }

    if (priority && priority !== '') {
      baseQuery = baseQuery.andWhere('posts.priority = :priority', {
        priority,
      })
    }

    if (type && type !== '') {
      baseQuery = baseQuery.andWhere('posts.type = :type', {
        type,
      })
    }

    const keys = Object.keys(JoinPostAbleType)

    const values = Object.values(JoinPostAbleType)

    const value = []

    let include = []

    if (includes) {
      const arr = includes.split(',')

      include = [...arr]

      arr.forEach((el) => {
        if (keys.includes(el)) value.push(values[`${keys.indexOf(el)}`])
      })
      const key = arr.filter((item) => keys.includes(item))

      for (let i = 0; i < key.length; i++) {
        baseQuery = baseQuery.leftJoinAndSelect(`${value[i]}`, `${key[i]}`)
      }

      // query category detail
      if (include.includes('categories'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `categories.category`,
          `category`,
          'categories.categoryAbleType = :categoryAbleType',
          { categoryAbleType: CategoryAbleType.post },
        )

      // query tag detail
      if (include.includes('tags'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `tags.tag`,
          `tag`,
          'tags.tagAbleType = :tagAbleType',
          {
            tagAbleType: TagAbleType.post,
          },
        )
    }
    return baseQuery
  }

  /**
   * Save post and attach foreign key
   * @param params.data CreatePostDto
   */
  async savePost(data: CreatePostDto): Promise<void> {
    const tagsAvailable = await this.tagService.findIdInOrFail(data.tagIds)

    const categoriesAvailable = await this.categoryService.findIdInOrFail(
      data.categoryIds,
    )

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
    const tagsAbleData = tagsAvailable.map((tag: any) => ({
      tagId: tag.id,
      tagAbleId: newPost.id,
      tagAbleType: TagAbleType.post,
    }))
    await this.tagAbleService.attachTagAble(tagsAbleData)

    // categoryAble
    const categoryAbleData = categoriesAvailable.map((category: any) => ({
      categoryId: category.id,
      categoryAbleId: newPost.id,
      categoryAbleType: CategoryAbleType.post,
    }))
    await this.categoryAbleService.attachCategoryAble(categoryAbleData)

    // imageAble
    const imageAbleData = imagesAvailable.map((image: any) => ({
      imageId: image.id,
      imageAbleId: newPost.id,
      imageAbleType: ImageAbleType.post,
    }))
    await this.imageAbleService.save(imageAbleData)
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
        imageAbleId: currentPost.id,
        imageAbleType: ImageAbleType.post,
        imageIds: data.imageIds,
      })
    }

    // tagAble
    if (data.tagIds && data.tagIds.length > 0) {
      await this.tagAbleService.updateRelationTagAble({
        tagAbleId: currentPost.id,
        tagAbleType: TagAbleType.post,
        tagIds: data.tagIds,
      })
    }

    // categoryAble
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.categoryAbleService.updateRelationCategoryAble({
        categoryAbleId: currentPost.id,
        categoryAbleType: CategoryAbleType.post,
        categoryIds: data.categoryIds,
      })
    }

    // update post
    const dataToUpdate = assign(data, { slug: slugify(data.title) })

    const count = await this.count({
      where: {
        title: data.title,
        type: data.type,
        slug: dataToUpdate.slug,
      },
    })

    if (currentPost.title === data.title && currentPost.type === data.type) {
      delete dataToUpdate.slug
    } else if (count) {
      dataToUpdate.slug = `${dataToUpdate.slug}-${count}`
    }

    await this.update(Number(id), dataToUpdate)
  }

  /**
   * Delete post and detach foreign key
   * @param params.id
   */
  async deletePost(id: number): Promise<void> {
    const currentPost: PostEntity = await this.findOneOrFail(id)

    await this.tagAbleService.detachTagAble([
      {
        tagAbleId: currentPost.id,
        tagAbleType: TagAbleType.post,
      },
    ])

    await this.categoryAbleService.detachCategoryAble([
      {
        categoryAbleId: currentPost.id,
        categoryAbleType: CategoryAbleType.post,
      },
    ])

    await this.imageAbleService.detachImageAble([
      {
        imageAbleId: currentPost.id,
        imageAbleType: ImageAbleType.post,
      },
    ])

    await this.destroy(currentPost.id)
  }
}
