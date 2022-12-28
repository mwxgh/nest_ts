import { Transformer } from '@shared/transformers/transformer'
import { CategoryEntity } from '../entities/category.entity'

export class CategoryTransformer extends Transformer {
  transform(model: CategoryEntity): any {
    return {
      id: model.id,
      name: model.name,
      parentId: model.parentId,
      status: model.status,
      categoryType: model.categoryType,
    }
  }
}
