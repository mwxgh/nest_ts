import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { CommonService } from '@sharedServices/common.service'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
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
