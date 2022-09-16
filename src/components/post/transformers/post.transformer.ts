import { Transformer } from 'src/shared/transformers/transformer'
import { PostEntity } from '../entities/post.entity'

export class PostTransformer extends Transformer {
  transform(data: PostEntity) {
    return data
  }
}
