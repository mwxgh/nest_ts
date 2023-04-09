import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { ImageEntity } from '../entities/image.entity'

export class ImageTransformer extends Transformer {
  transform(model: ImageEntity): ResponseEntity {
    return {
      model,
    }
  }
}
