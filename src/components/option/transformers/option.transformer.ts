import { Transformer } from '../../../shared/transformers/transformer';
import { Option } from '../entities/option.entity';

export class OptionTransformer extends Transformer {
  transform(model: Option): any {
    return {
      id: model.id,
      key: model.key,
      value: model.value,
    };
  }
}
