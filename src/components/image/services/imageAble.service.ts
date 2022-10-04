import { Injectable } from '@nestjs/common'
import { difference } from 'lodash'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository } from 'typeorm'
import { ImageEntity } from '../entities/image.entity'
import { ImageAbleEntity, ImageAbleType } from '../entities/imageAble.entity'
import { ImageAbleRepository } from '../repositories/imageAble.repository'
import { ImageService } from './image.service'

@Injectable()
export class ImageAbleService extends BaseService {
  public imageAbleRepository: Repository<any>
  public entity: any = ImageAbleEntity

  constructor(
    private connection: Connection,
    private imageService: ImageService,
  ) {
    super()
    this.imageAbleRepository =
      this.connection.getCustomRepository(ImageAbleRepository)
  }

  /**
   * Attach imageAble when crate or update product, post, ...
   * @param params.imageId number
   * @param params.imageAbleId number
   * @param params.imageAbleType ImageAbleType
   */
  async attachImageAble(
    params: {
      imageId: number
      imageAbleId: number
      imageAbleType: ImageAbleType
    }[],
  ): Promise<void> {
    params.forEach(async (param: any) => {
      const { imageId, imageAbleId, imageAbleType } = param

      const imageAble = new ImageAbleEntity()

      imageAble.imageId = imageId
      imageAble.imageAbleId = imageAbleId
      imageAble.imageAbleType = imageAbleType

      await this.imageAbleRepository.save(imageAble)
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
   * @param params.imageAbleId
   * @param params.imageAbleType
   */
  async detachImageAble(
    params: { imageAbleId: number; imageAbleType: string }[],
  )

  /**
   * Detach imageAble
   * @param params.imageId
   * @param params.imageAbleId
   * @param params.imageAbleType
   * - Detach imageAble when delete image -> All product, post, ... need to remove foreign key to this image
   * - Detach imageAble when delete product, post, ... -> Some image need to remove foreign key to this product, post
   */
  async detachImageAble(
    params: {
      imageId?: number
      imageAbleId?: number
      imageAbleType?: string
    }[],
  ): Promise<void> {
    const imageAbleIdsExisting: number[] = await this.findWhere(params, ['id'])

    if (imageAbleIdsExisting.length > 0) {
      await this.imageAbleRepository.delete(imageAbleIdsExisting)
    }
  }

  /**
   * Update relation imageAble when update product, post, ...
   * @param params.imageId
   * @param params.imageAbleId
   * @param params.imageAbleType
   */
  async updateRelationImageAble(params: {
    imageIds: number[]
    imageAbleId: number
    imageAbleType: ImageAbleType
  }): Promise<void> {
    const { imageIds, imageAbleId, imageAbleType } = params

    const currentImageIds: number[] = await this.findWhere(
      {
        imageAbleId,
        imageAbleType,
      },
      ['imageId'],
    )

    if (currentImageIds.length === 0) {
      return
    }

    // detach new imageAble
    const detachImageIds: number[] = difference(currentImageIds, imageIds)

    const imageAbles = detachImageIds.map((imageAbleId) => ({
      imageAbleId,
      imageAbleType,
    }))

    await this.detachImageAble(imageAbles)

    // attach new imageAble
    const newAttachImageIds: number[] = difference(imageIds, currentImageIds)

    const existingImages = await this.imageService.findIdInOrFail(
      newAttachImageIds,
    )

    const imagesAbleData = existingImages.map((image: ImageEntity) => ({
      imageId: image.id,
      imageAbleId,
      imageAbleType,
    }))

    await this.attachImageAble(imagesAbleData)
  }
}
