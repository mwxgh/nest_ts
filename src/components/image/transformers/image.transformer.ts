import { Transformer } from '../../../shared/transformers/transformer';
import { ImageEntity } from '../entities/image.entity';

export class ImageTransformer extends Transformer {
  transform(model: ImageEntity): any {
    return {
      model,
    };
  }
}
