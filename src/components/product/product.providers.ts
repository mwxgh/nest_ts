import { CommonService } from '@sharedServices/common.service'
import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { ProductService } from './services/product.service'

export const productProviders = [
  ProductService,
  ImageService,
  ImageAbleService,
  CategoryService,
  CategoryAbleService,
  TagService,
  TagAbleService,
  CommonService,
]
