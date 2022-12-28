import { CommonService } from '@sharedServices/common.service'
import { CommentService } from './services/comment.service'

export const commentProviders = [CommentService, CommonService]
