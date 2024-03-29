import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto'
import { ImageEntity } from '../entities/image.entity'
import { ImageRepository } from '../repositories/image.repository'
import { ImageAbleService } from './imageAble.service'

@Injectable()
export class ImageService extends BaseService {
  public repository: Repository<ImageEntity>
  public entity: Entity = ImageEntity

  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => ImageAbleService))
    private imageAble: ImageAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(ImageRepository)
  }

  /**
   * Save image
   *
   * @param file Express.Multer.File
   * @param data CreateImageDto
   *
   * @returns ImageEntity
   */
  async saveImage({
    file,
    data,
  }: {
    file: Express.Multer.File
    data: CreateImageDto
  }): Promise<ImageEntity> {
    Object.assign(data, {
      slug: await this.generateSlug(data.title),
      url: file.path,
    })

    return this.create(data)
  }

  /**
   * Update image
   *
   * @param id number
   * @param data UpdateImageDto
   *
   * @returns ImageEntity
   */
  async updateImage({
    id,
    data,
  }: {
    id: number
    data: UpdateImageDto
  }): Promise<ImageEntity> {
    await this.checkExisting({ where: { id } })

    Object.assign(data, { slug: await this.generateSlug(data.title) })

    return this.update(id, data)
  }

  /**
   * Delete image
   *
   * @param id number
   */
  async deleteImage(id: number): Promise<void> {
    await this.checkExisting({ where: { id } })

    await this.imageAble.detachImageAble([{ imageId: id }])

    await this.destroy(id)
  }
}
