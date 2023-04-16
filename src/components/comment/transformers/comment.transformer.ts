import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { CommentEntity } from '../entities/comment.entity'

export class CommentTransformer extends Transformer {
  transform(comment: CommentEntity): ResponseEntity {
    return {
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      parentId: comment.parentId,
      status: comment.status,
      verifiedAt: comment.verifiedAt,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      deletedAt: comment.deletedAt,
    }
  }

  includeChildren(comment: CommentEntity): Entity[] {
    return this.collection(comment.children, new CommentTransformer())
  }
}
