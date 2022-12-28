import { CategoryAbleService } from './services/categoryAble.service'
import { CategoryService } from './services/category.service'
import { CommonService } from '@sharedServices/common.service'

export const categoryProviders = [
  CategoryService,
  CategoryAbleService,
  CommonService,
]
