import { CommonService } from '@sharedServices/common.service'
import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { ProductService } from '@productModule/services/product.service'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { CartService } from './services/cart.service'
import { CartItemService } from './services/cartItem.service'

export const cartProviders = [
  CartService,
  CartItemService,
  ProductService,
  ImageService,
  ImageAbleService,
  CategoryAbleService,
  CommonService,
  TagAbleService,
  TagService,
  CategoryService,
]
