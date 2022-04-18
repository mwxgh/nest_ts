import { Transformer } from '../../../shared/transformers/transformer';
import { Category } from '../entities/category.entity';

export class CategoryTransformer extends Transformer {
  transform(model: Category): any {
    return {
      id: model.id,
      name: model.name,
      parentId: model.parentId,
      status: model.status,
      categoryType: model.categoryType,
    };
  }
}
