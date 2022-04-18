import { Transformer } from '../../../shared/transformers/transformer';
import { CategoryAble } from '../entities/categoryAble.entity';

export class CategoriableTransformer extends Transformer {
  data = (data) => {
    return {
      id: data.id,
      name: data.name,
      status: data.status,
    };
  };
  transform(model: CategoryAble): any {
    return this.data(model.category);
  }
}
