import { CommonService } from '@sharedServices/common.service'
import { CategoryService } from './services/category.service'
import { CategoryAbleService } from './services/categoryAble.service'

export const categoryProviders = [
  CategoryService,
  CategoryAbleService,
  CommonService,
]
