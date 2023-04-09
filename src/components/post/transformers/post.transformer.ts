import { CategoryTransformer } from '@categoryModule/transformers/category.transformer'
import { ImageTransformer } from '@imageModule/transformers/image.transformer'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { TagTransformer } from '@tagModule/transformers/tag.transformer'
import { PostEntity } from '../entities/post.entity'

export class PostTransformer extends Transformer {
  transform(model: PostEntity): ResponseEntity {
    return {
      id: model.id,
      title: model.title,
      slug: model.slug,
      summary: model.summary,
      description: model.description,
      content: model.content,
      status: model.status,
      priority: model.priority,
      type: model.type,
      privacy: model.privacy,
      releaseDate: model.releaseDate,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }

  includeImages(model: PostEntity): Entity[] {
    return this.collection(model.images, new ImageTransformer())
  }

  includeCategories(model: PostEntity): Entity[] {
    return this.collection(model.categories, new CategoryTransformer())
  }

  includeTags(model: PostEntity): Entity[] {
    return this.collection(model.tags, new TagTransformer())
  }
}
