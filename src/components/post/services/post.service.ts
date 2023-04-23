import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'

import { CommentService } from '@commentModule/services/comment.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { QueryParams } from '@shared/interfaces/request.interface'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { isNil } from 'lodash'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'
import {
  PostEntity,
  PostPriority,
  PostPrivacy,
  PostStatus,
  PostType,
} from '../entities/post.entity'
import { PostRepository } from '../repositories/post.repository'

@Injectable()
export class PostService extends BaseService {
  public repository: Repository<PostEntity>
  public entity: Entity = PostEntity

  constructor(
    private connection: Connection,
    private tagAble: TagAbleService,
    private categoryAble: CategoryAbleService,
    private imageAble: ImageAbleService,
    private comment: CommentService,
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
  ): Promise<[SelectQueryBuilder<PostEntity>, string[]]> {
    const {
      entity,
      fields,
      keyword,
      includes,
      relations,
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

    let includesParams = undefined
    if (!isNil(includes) && !isNil(relations)) {
      includesParams = Array.isArray(includes) ? includes : [includes]

      this.checkIncludeParam({
        includesParams,
        relations,
      })

      // query image association
      if (includesParams.includes('images')) {
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.images`,
          'images',
          'images.ableType = :ableType',
          { ableType: AbleType.post },
        )
      }
      // query category association
      if (includesParams.includes('categories'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.categories`,
          `categories`,
          'categories.ableType = :ableType',
          { ableType: AbleType.post },
        )

      // query tag association
      if (includesParams.includes('tags'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.tags`,
          `tags`,
          'tags.ableType = :ableType',
          {
            ableType: AbleType.post,
          },
        )

      // query comments association
      if (includesParams.includes('comments'))
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.comments`,
          'postComments',
        )
    }

    return [baseQuery, includesParams]
  }

  /**
   * Save post and attach foreign key
   * @param params.data CreatePostDto
   */
  async savePost(data: CreatePostDto): Promise<PostEntity> {
    data.releaseDate = data.releaseDate ?? new Date()
    data.status = data.status ?? PostStatus.pending
    data.priority = data.priority ?? PostPriority.medium
    data.type = data.type ?? PostType.content
    data.privacy = data.privacy ?? PostPrivacy.public
    Object.assign(data, { slug: await this.generateSlug(data.title) })

    const post: PostEntity = await this.create(data)

    // tagAble
    if (!isNil(data.categoryIds)) {
      await this.tagAble.attachTagAble({
        tagIds: data.tagIds,
        ableId: post.id,
        ableType: AbleType.post,
      })
    }

    // categoryAble
    if (!isNil(data.categoryIds)) {
      await this.categoryAble.attachCategoryAble({
        categoryIds: data.categoryIds,
        ableId: post.id,
        ableType: AbleType.post,
      })
    }

    // imageAble
    if (!isNil(data.imageIds)) {
      await this.imageAble.attachImageAble({
        imageIds: data.imageIds,
        ableId: post.id,
        ableType: AbleType.post,
      })
    }

    return post
  }

  /**
   * Update post and update relation foreign key
   * @param params.id
   * @param params.data UpdatePostDto
   */
  async updatePost({
    id,
    data,
  }: {
    id: number
    data: UpdatePostDto
  }): Promise<PostEntity> {
    await this.checkExisting({ where: { id } })

    // imageAble
    if (!isNil(data.imageIds) && data.imageIds.length > 0) {
      await this.imageAble.updateRelationImageAble({
        ableId: id,
        ableType: AbleType.post,
        imageIds: data.imageIds,
      })
    }

    // tagAble
    if (!isNil(data.tagIds) && data.tagIds.length > 0) {
      await this.tagAble.updateRelationTagAble({
        ableId: id,
        ableType: AbleType.post,
        tagIds: data.tagIds,
      })
    }

    // categoryAble
    if (!isNil(data.categoryIds) && data.categoryIds.length > 0) {
      await this.categoryAble.updateRelationCategoryAble({
        ableId: id,
        ableType: AbleType.post,
        categoryIds: data.categoryIds,
      })
    }

    // update post

    if (!isNil(data.title)) {
      Object.assign(data, { slug: await this.generateSlug(data.title) })
    }

    return this.update(id, data)
  }

  /**
   * Delete post and detach foreign key
   * @param params.id
   */
  async deletePost(id: number): Promise<void> {
    const currentPost: PostEntity = await this.findOneOrFail(id)

    await this.tagAble.detachTagAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.categoryAble.detachCategoryAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.imageAble.detachImageAble([
      {
        ableId: currentPost.id,
        ableType: AbleType.post,
      },
    ])

    await this.comment.destroy({ where: { postId: currentPost.id } })

    await this.destroy(currentPost.id)
  }
}
