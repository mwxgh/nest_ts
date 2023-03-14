import { Transformer } from '@shared/transformers/transformer'
import { CommentEntity } from '../entities/comment.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class CommentTransformer extends Transformer {
  transform(model: CommentEntity): ResponseEntity {
    return model
  }
}
