import { Transformer } from 'src/shared/transformers/transformer';
import { PostAble } from '../entities/post.entity';

export class PostTransformer extends Transformer {
  transform(data: PostAble) {
    return data;
  }
}
