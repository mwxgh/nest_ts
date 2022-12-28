import { Injectable } from '@nestjs/common'
import { assign } from 'lodash'
import slugify from 'slugify'
import { BaseService } from '@sharedServices/base.service'
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

  async saveImage(params: {
    file: Express.Multer.File
    data: CreateImageDto
  }): Promise<void> {
    const { file, data } = params

    const countImages = await this.count({
      where: { title: data.title },
    })

    const assignSlug = assign(data, {
      slug: slugify(data.title),
    })

    if (countImages) assignSlug.slug = `${assignSlug.slug}-${countImages}`

    const newFile = assign({}, file, {
      key: file.filename,
      location: process.env.APP_URL + '/public/uploads/' + file.filename,
    })

    const assignUrlFile = assign(assignSlug, {
      url: newFile.location,
    })

    const image = { ...assignUrlFile }

    await this.save(image)
  }

  async updateImage(params: {
    id: number
    data: UpdateImageDto
  }): Promise<void> {
    const { id, data } = params
    const currentImage = await this.findOneOrFail(id)

    const countImages = await this.count({
      where: { title: data.title },
    })

    if (data.title !== currentImage.title) {
      const assignSlug = assign(data, { slug: slugify(data.title) })

      if (countImages) assignSlug.slug = `${assignSlug.slug}-${countImages}`

      const imageUpdate = { ...assignSlug }

      await this.update(id, imageUpdate)
    } else {
      await this.update(id, data)
    }
  }

  async deleteImage(params: { id: number }): Promise<void> {
    const { id } = params

    await this.findOneOrFail(id)

    await this.destroy(id)
  }
}
