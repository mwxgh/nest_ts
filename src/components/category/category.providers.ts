import { PrimitiveService } from '@shared/services/primitive.service'
import { CategoryService } from './services/category.service'
import { CategoryAbleService } from './services/categoryAble.service'

export const categoryProviders = [
  CategoryService,
  CategoryAbleService,
  PrimitiveService,
]
