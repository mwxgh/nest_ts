import { CategoryAbleTransformer } from '@categoryModule/transformers/categoryAble.transformer'
import { CommentTransformer } from '@commentModule/transformers/comment.transformer'
import { ImageTransformer } from '@imageModule/transformers/image.transformer'
import { Transformer } from '@shared/transformers/transformer'
import { ProductEntity } from '../entities/product.entity'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'

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
    return this.collection(model.categories, new CategoryAbleTransformer())
  }

  includeComments(model: ProductEntity): Entity[] {
    return this.collection(model.comments, new CommentTransformer())
  }
}
