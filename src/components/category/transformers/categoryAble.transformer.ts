import { Transformer } from '../../../shared/transformers/transformer';
import { CategoryAbleEntity } from '../entities/categoryAble.entity';

export class CategoryAbleTransformer extends Transformer {
  data = (data) => {
    return {
      id: data.id,
      name: data.name,
      status: data.status,
    };
  };
  transform(model: CategoryAbleEntity): any {
    return this.data(model.category);
  }
}
