import { CategoryTransformer } from '@categoryModule/transformers/category.transformer'
import { ImageTransformer } from '@imageModule/transformers/image.transformer'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { TagTransformer } from '@tagModule/transformers/tag.transformer'
import { ProductEntity } from '../entities/product.entity'

export class ProductTransformer extends Transformer {
  transform(model: ProductEntity): ResponseEntity {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      sku: model.sku,
      originalPrice: model.originalPrice,
      price: model.price,
      quantity: model.quantity,
      status: model.status,
    }
  }

  includeImages(model: ProductEntity): Entity[] {
    return this.collection(model.images, new ImageTransformer())
  }

  includeCategories(model: ProductEntity): Entity[] {
    return this.collection(model.categories, new CategoryTransformer())
  }

  includeTags(model: ProductEntity): Entity[] {
    return this.collection(model.tags, new TagTransformer())
  }
}
