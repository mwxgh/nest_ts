import { Transformer } from '@shared/transformers/transformer'
import { CommentEntity } from '../entities/comment.entity'

export class CommentTransformer extends Transformer {
  transform(model: CommentEntity): any {
    return model
  }
}
