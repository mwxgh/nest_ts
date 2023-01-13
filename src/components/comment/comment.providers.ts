import { PrimitiveService } from '@shared/services/primitive.service'
import { CommentService } from './services/comment.service'

export const commentProviders = [CommentService, PrimitiveService]
