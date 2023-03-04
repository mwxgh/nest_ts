import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { assign } from 'lodash'
import slugify from 'slugify'
import { Connection, Repository } from 'typeorm'
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto'
import { ImageEntity } from '../entities/image.entity'
import { ImageRepository } from '../repositories/image.repository'

@Injectable()
export class ImageService extends BaseService {
  public repository: Repository<any>
  public entity: any = ImageEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(ImageRepository)
  }

  async assignSlug(params: {
    data: CreateImageDto | UpdateImageDto
    currentImage?: ImageEntity
  }) {
    const { data, currentImage } = params

    console.log(currentImage)

    const assignSlug = assign(data, {
      slug: slugify(data.title),
    })

    const countImages = await this.count({
      where: { title: data.title },
    })

    if (countImages) assignSlug.slug = `${assignSlug.slug}-${countImages}`
  }

  async saveImage(params: {
    file: Express.Multer.File
    data: CreateImageDto
  }): Promise<ImageEntity> {
    const { file, data } = params

    await this.assignSlug({ data })

    Object.assign(data, { url: file.path })

    return this.create(data)
  }

  async updateImage(params: {
    id: number
    data: UpdateImageDto
  }): Promise<any> {
    const { id, data } = params
    const currentImage: ImageEntity = await this.findOneOrFail(id)

    await this.assignSlug({ data, currentImage })

    // return this.update(id, data)
  }

  async deleteImage(params: { id: number }): Promise<void> {
    const { id } = params

    await this.findOneOrFail(id)

    await this.destroy(id)
  }
}
