import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { difference } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { TagEntity } from '../entities/tag.entity'
import { TagAbleEntity } from '../entities/tagAble.entity'
import { TagAbleRepository } from '../repositories/tagAble.repository'
import { TagService } from './tag.service'
import { Entity } from '@shared/interfaces/response.interface'
import { AbleType } from '@shared/entities/base.entity'

@Injectable()
export class TagAbleService extends BaseService {
  public tagAbleRepository: Repository<TagAbleEntity>
  public entity: Entity = TagAbleEntity
  constructor(private connection: Connection, private tagService: TagService) {
    super()
    this.tagAbleRepository =
      this.connection.getCustomRepository(TagAbleRepository)
  }

  /**
   * Attach tagAble
   * @param params.tagId
   * @param params.ableId
   * @param params.ableType
   */
  async attachTagAble(
    params: {
      tagId: number
      ableId: number
      ableType: AbleType
    }[],
  ): Promise<void> {
    params.forEach(async (param: any) => {
      await this.tagAbleRepository.save(param)
    })
  }

  /**
   * Detach tagAble when delete tag
   * All product, post, ... need to remove foreign key to this tag
   * @param params.tagId
   */
  async detachTagAble(params: { tagId: number }[])

  /**
   * Detach tagAble when delete product, post, ...
   * Some tag need to remove foreign key to this product, post
   * @param params.ableId
   * @param params.ableType
   */
  async detachTagAble(params: { ableId: number; ableType: string }[])

  /**
   * Detach tagAble
   * @param params.tagId
   * @param params.ableId
   * @param params.ableType
   */
  async detachTagAble(
    params: {
      tagId?: number
      ableId?: number
      ableType?: string
    }[],
  ): Promise<void> {
    const tagAbleIdsExisting: number[] = await this.findWhere(params, ['id'])

    if (tagAbleIdsExisting.length > 0) {
      await this.tagAbleRepository.delete(tagAbleIdsExisting)
    }
  }

  /**
   * Update relation tagAble when update product, post, ...
   * @param params.tagId
   * @param params.ableId
   * @param params.ableType
   */
  async updateRelationTagAble(params: {
    tagIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    const { tagIds, ableId, ableType } = params

    const currentTagIds: number[] = await this.findWhere(
      {
        ableId,
        ableType,
      },
      ['tagId'],
    )

    if (currentTagIds.length === 0) {
      return
    }

    // detach tagAble
    const detachTagIds: number[] = difference(currentTagIds, tagIds)

    const tagAbles = detachTagIds.map((ableId) => ({
      ableId,
      ableType,
    }))

    await this.detachTagAble(tagAbles)

    // attach new tagAble
    const newAttachTagIds: number[] = difference(tagIds, currentTagIds)

    const existingTags = await this.tagService.findIdInOrFail(newAttachTagIds)

    const tagsAbleData = existingTags.map((tag: TagEntity) => ({
      tagId: tag.id,
      ableId,
      ableType,
    }))

    await this.attachTagAble(tagsAbleData)
  }
}
