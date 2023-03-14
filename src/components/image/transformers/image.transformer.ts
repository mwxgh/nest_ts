import { Transformer } from '@shared/transformers/transformer'
import { ImageEntity } from '../entities/image.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class ImageTransformer extends Transformer {
  transform(model: ImageEntity): ResponseEntity {
    return {
      model,
    }
  }
}
