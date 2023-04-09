import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { TagAbleEntity } from '../entities/tagAble.entity'

export class TagAbleTransformer extends Transformer {
  transform(model: TagAbleEntity): ResponseEntity {
    return model
  }
}
