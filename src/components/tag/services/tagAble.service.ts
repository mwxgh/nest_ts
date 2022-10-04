import { Injectable } from '@nestjs/common'
import { difference } from 'lodash'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository } from 'typeorm'
import { TagEntity } from '../entities/tag.entity'
import { TagAbleEntity, TagAbleType } from '../entities/tagAble.entity'
import { TagAbleRepository } from '../repositories/tagAble.repository'
import { TagService } from './tag.service'

@Injectable()
export class TagAbleService extends BaseService {
  public tagAbleRepository: Repository<any>
  public entity: any = TagAbleEntity
  constructor(private connection: Connection, private tagService: TagService) {
    super()
    this.tagAbleRepository =
      this.connection.getCustomRepository(TagAbleRepository)
  }

  /**
   * Attach tagAble
   * @param params.tagId
   * @param params.tagAbleId
   * @param params.tagAbleType
   */
  async attachTagAble(
    params: {
      tagId: number
      tagAbleId: number
      tagAbleType: TagAbleType
    }[],
  ): Promise<void> {
    params.forEach(async (param: any) => {
      const { tagId, tagAbleId, tagAbleType } = param

      const tagAble = new TagAbleEntity()

      tagAble.tagId = tagId
      tagAble.tagAbleId = tagAbleId
      tagAble.tagAbleType = tagAbleType

      await this.tagAbleRepository.save(tagAble)
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
   * @param params.tagAbleId
   * @param params.tagAbleType
   */
  async detachTagAble(params: { tagAbleId: number; tagAbleType: string }[])

  /**
   * Detach tagAble
   * @param params.tagId
   * @param params.tagAbleId
   * @param params.tagAbleType
   */
  async detachTagAble(
    params: {
      tagId?: number
      tagAbleId?: number
      tagAbleType?: string
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
   * @param params.tagAbleId
   * @param params.tagAbleType
   */
  async updateRelationTagAble(params: {
    tagIds: number[]
    tagAbleId: number
    tagAbleType: TagAbleType
  }): Promise<void> {
    const { tagIds, tagAbleId, tagAbleType } = params

    const currentTagIds: number[] = await this.findWhere(
      {
        tagAbleId,
        tagAbleType,
      },
      ['tagId'],
    )

    if (currentTagIds.length === 0) {
      return
    }

    // detach tagAble
    const detachTagIds: number[] = difference(currentTagIds, tagIds)

    const tagAbles = detachTagIds.map((tagAbleId) => ({
      tagAbleId,
      tagAbleType,
    }))

    await this.detachTagAble(tagAbles)

    // attach new tagAble
    const newAttachTagIds: number[] = difference(tagIds, currentTagIds)

    const existingTags = await this.tagService.findIdInOrFail(newAttachTagIds)

    const tagsAbleData = existingTags.map((tag: TagEntity) => ({
      tagId: tag.id,
      tagAbleId,
      tagAbleType,
    }))

    await this.attachTagAble(tagsAbleData)
  }
}
