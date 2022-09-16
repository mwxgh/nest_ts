import { Transformer } from '../../../shared/transformers/transformer'
import { ProductEntity } from '../entities/product.entity'
import { ImageTransformer } from '../../image/transformers/image.transformer'
import { CategoryAbleTransformer } from 'src/components/category/transformers/categoryAble.transformer'
import { CommentTransformer } from 'src/components/comment/transformers/comment.transformer'

export class ProductTransformer extends Transformer {
  transform(model: ProductEntity): any {
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

  includeImages(model): any {
    return this.collection(model.images, new ImageTransformer())
  }

  includeCategories(model): any {
    return this.collection(model.categories, new CategoryAbleTransformer())
  }

  includeComments(model): any {
    return this.collection(model.comments, new CommentTransformer())
  }
}
