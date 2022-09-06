import { CommonService } from 'src/shared/services/common.service';
import { CommentService } from './services/comment.service';

export const commentProviders = [CommentService, CommonService];
