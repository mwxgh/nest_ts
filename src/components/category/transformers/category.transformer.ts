import { Transformer } from '@shared/transformers/transformer'
import { CategoryEntity } from '../entities/category.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class CategoryTransformer extends Transformer {
  transform(model: CategoryEntity): ResponseEntity {
    return {
      id: model.id,
      name: model.name,
      parentId: model.parentId,
      status: model.status,
      categoryType: model.categoryType,
    }
  }
}
