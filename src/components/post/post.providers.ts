import { CommonService } from 'src/shared/services/common.service'
import { CategoryService } from '../category/services/category.service'
import { CategoryAbleService } from '../category/services/categoryAble.service'
import { ImageService } from '../image/services/image.service'
import { ImageAbleService } from '../image/services/imageAble.service'
import { TagService } from '../tag/services/tag.service'
import { TagAbleService } from '../tag/services/tagAble.service'
import { PostService } from './services/post.service'

export const postProviders = [
  PostService,
  ImageService,
  ImageAbleService,
  TagAbleService,
  CategoryAbleService,
  TagService,
  CategoryService,
  CommonService,
]
