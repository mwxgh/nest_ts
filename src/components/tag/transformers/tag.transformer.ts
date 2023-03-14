import { Transformer } from '@shared/transformers/transformer'
import { TagEntity } from '../entities/tag.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class TagTransformer extends Transformer {
  transform(model: TagEntity): ResponseEntity {
    if (!model.tagAbles) {
      return model
    } else {
      const posts = []
      const products = []
      model.tagAbles.map((i) => {
        if (i.product) products.push(i.product)
        if (i.post) posts.push(i.post)
      })
      return {
        id: model.id,
        name: model.name,
        status: model.status,
        verifiedAt: model.verifiedAt,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        posts: posts,
        products: products,
      }
    }
  }
}
