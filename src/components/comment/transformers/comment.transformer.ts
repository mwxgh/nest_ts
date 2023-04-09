import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { CommentEntity } from '../entities/comment.entity'

export class CommentTransformer extends Transformer {
  transform(model: CommentEntity): ResponseEntity {
    return model
  }
}
