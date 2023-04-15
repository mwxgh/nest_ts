import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { ImageEntity } from '../entities/image.entity'

export class ImageTransformer extends Transformer {
  transform(image: ImageEntity): ResponseEntity {
    return {
      id: image.id,
      title: image.title,
      url: image.url,
      slug: image.slug,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      deletedAt: image.deletedAt,
    }
  }
}
