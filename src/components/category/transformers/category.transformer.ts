import { ProductTransformer } from '@productModule/transformers/product.transformer'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { CategoryEntity } from '../entities/category.entity'

export class CategoryTransformer extends Transformer {
  transform(model: CategoryEntity): ResponseEntity {
    return {
      id: model.id,
      name: model.name,
      parentId: model.parentId,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }

  includeProducts(model: CategoryEntity): Entity[] {
    return this.collection(model.products, new ProductTransformer())
  }

  includeChildren(model: CategoryEntity): Entity[] {
    return this.collection(model.children, new CategoryTransformer())
  }
}
