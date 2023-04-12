import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { TagEntity } from '../entities/tag.entity'

export class TagTransformer extends Transformer {
  transform(model: TagEntity): ResponseEntity {
    const tag = {
      id: model.id,
      name: model.name,
      status: model.status,
      slug: model.slug,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }

    if (!model.tagAbles) {
      return tag
    }

    const posts = []
    const products = []
    model.tagAbles.map((i) => {
      if (i.product) products.push(i.product)
      if (i.post) posts.push(i.post)
    })
    return {
      ...tag,
      posts: posts,
      products: products,
    }
  }
}
