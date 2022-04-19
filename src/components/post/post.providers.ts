import { CategoryAbleService } from '../category/services/categoryAble.service';
import { ImageService } from '../image/services/image.service';
import { TagAbleService } from '../tag/services/tagAble.service';
import { PostService } from './services/post.service';

export const postProviders = [
  PostService,
  ImageService,
  TagAbleService,
  CategoryAbleService,
];
