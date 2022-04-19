import { Transformer } from '../../../shared/transformers/transformer';
import { TagAble } from '../entities/tagAble.entity';

export class TagAbleTransformer extends Transformer {
  transform(model: TagAble): any {
    return model;
  }
}
