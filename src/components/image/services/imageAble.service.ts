import { Injectable } from '@nestjs/common'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository } from 'typeorm'
import { ImageAbleEntity, ImageAbleType } from '../entities/imageAble.entity'
import { ImageAbleRepository } from '../repositories/imageAble.repository'

@Injectable()
export class ImageAbleService extends BaseService {
  public imageAbleRepository: Repository<any>
  public entity: any = ImageAbleEntity

  constructor(private connection: Connection) {
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
    const imageAbleIdsExisting: number[] = await this.findWhere({
      where: params,
      select: ['id'],
    })

    if (imageAbleIdsExisting.length > 0) {
      await this.imageAbleRepository.delete(imageAbleIdsExisting)
    }
  }
}
