import { Transformer } from '@shared/transformers/transformer'
import { TagAbleEntity } from '../entities/tagAble.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class TagAbleTransformer extends Transformer {
  transform(model: TagAbleEntity): ResponseEntity {
    return model
  }
}
