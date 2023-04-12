import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { difference } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { ImageAbleEntity } from '../entities/imageAble.entity'
import { ImageAbleRepository } from '../repositories/imageAble.repository'
import { ImageService } from './image.service'

@Injectable()
export class ImageAbleService extends BaseService {
  public repository: Repository<ImageAbleEntity>
  public entity: Entity = ImageAbleEntity

  constructor(
    private connection: Connection,
    private imageService: ImageService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(ImageAbleRepository)
  }

  /**
   * Attach imageAble when crate or update product, post, ...
   * @param params.imageIds number[]
   * @param params.ableId number
   * @param params.ableType AbleType
   */
  async attachImageAble({
    imageIds,
    ableId,
    ableType,
  }: {
    imageIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    imageIds.map(async (imageId) => {
      await this.imageService.checkExisting({ where: { id: imageId } })

      await this.save({ imageId, ableId, ableType })
    })
  }

  /**
   * Detach imageAble when delete image
   * All product, post, ... need to remove foreign key to this image
   * @param params.imageId number
   */
  async detachImageAble(params: { imageId: number }[])

  /**
   * Detach imageAble when delete product, post, ...
   * Some image need to remove foreign key to this product, post
   * @param params.ableId
   * @param params.ableType
   */
  async detachImageAble(params: { ableId: number; ableType: string }[])

  /**
   * Detach imageAble
   * @param params.imageId
   * @param params.ableId
   * @param params.ableType
   * - Detach imageAble when delete image -> All product, post, ... need to remove foreign key to this image
   * - Detach imageAble when delete product, post, ... -> Some image need to remove foreign key to this product, post
   */
  async detachImageAble(
    params: {
      imageId?: number
      ableId?: number
      ableType?: string
    }[],
  ): Promise<void> {
    const ableIdsExisting: number[] = await this.findWhere(params, ['id'])

    if (ableIdsExisting.length > 0) {
      await this.destroy(ableIdsExisting)
    }
  }

  /**
   * Update relation imageAble when update product, post, ...
   * @param params.imageId
   * @param params.ableId
   * @param params.ableType
   */
  async updateRelationImageAble(params: {
    imageIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    const { imageIds, ableId, ableType } = params

    const currentImageIds: number[] = await this.findWhere(
      {
        ableId,
        ableType,
      },
      ['imageId'],
    )

    if (currentImageIds.length === 0) {
      return
    }

    // detach new imageAble
    const detachImageIds: number[] = difference(currentImageIds, imageIds)

    const imageAbles = detachImageIds.map((ableId) => ({
      ableId,
      ableType,
    }))

    await this.detachImageAble(imageAbles)

    // attach new imageAble
    const newAttachImageIds: number[] = difference(imageIds, currentImageIds)

    await this.attachImageAble({
      imageIds: newAttachImageIds,
      ableId,
      ableType,
    })
  }
}
