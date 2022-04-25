import { Transformer } from '../../../shared/transformers/transformer';
import { Image } from '../entities/image.entity';

export class ImageTransformer extends Transformer {
  transform(model: Image): any {
    return {
      model,
    };
  }
}
