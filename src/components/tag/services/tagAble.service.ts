import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { difference } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { TagAbleEntity } from '../entities/tagAble.entity'
import { TagAbleRepository } from '../repositories/tagAble.repository'
import { TagService } from './tag.service'

@Injectable()
export class TagAbleService extends BaseService {
  public repository: Repository<TagAbleEntity>
  public entity: Entity = TagAbleEntity
  constructor(private connection: Connection, private tagService: TagService) {
    super()
    this.repository = this.connection.getCustomRepository(TagAbleRepository)
  }

  /**
   * Attach tagAble
   * @param params.tagIds number[]
   * @param params.ableId number
   * @param params.ableType AbleType
   */
  async attachTagAble({
    tagIds,
    ableId,
    ableType,
  }: {
    tagIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    tagIds.map(async (tagId) => {
      await this.tagService.checkExisting({ where: { id: tagId } })

      await this.save({ tagId, ableId, ableType })
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
      await this.destroy(tagAbleIdsExisting)
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

    await this.attachTagAble({
      tagIds: newAttachTagIds,
      ableId,
      ableType,
    })
  }
}
