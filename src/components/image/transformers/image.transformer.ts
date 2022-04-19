import { Transformer } from '../../../shared/transformers/transformer';
import { Image } from '../entities/image.entity';

export class ImageTransformer extends Transformer {
  transform(model: Image): any {
    return {
      id: model.id,
      imageAbleId: model.imageAbleId,
      imageAbleType: model.imageAbleType,
      url: model.url,
      isThumbnail: model.isThumbnail,
    };
  }
}
