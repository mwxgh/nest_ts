import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto'
import { ImageEntity } from '../entities/image.entity'
import { ImageRepository } from '../repositories/image.repository'
import { Entity } from '@shared/interfaces/response.interface'

@Injectable()
export class ImageService extends BaseService {
  public repository: Repository<ImageEntity>
  public entity: Entity = ImageEntity

  constructor(
    private connection: Connection, // private imageAbleService: ImageAbleService,
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
    Object.assign(data, { slug: await this.generateSlug(data.title) })

    Object.assign(data, { url: file.path })

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

    // await this.imageAbleService.detachImageAble([{ imageId: id }])

    await this.destroy(id)
  }
}
