import { Transformer } from '../../../../src/shared/transformers/transformer';
import { Comment } from '../entities/comment.entity';

export class CommentTransformer extends Transformer {
  transform(model: Comment): any {
    return model;
  }
}
