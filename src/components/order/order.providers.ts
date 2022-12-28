import { CartService } from '@cartModule/services/cart.service'
import { CartItemService } from '@cartModule/services/cartItem.service'
import { CategoryService } from '@categoryModule/services/category.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { ProductService } from '@productModule/services/product.service'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { OrderService } from './services/order.service'
import { OrderProductService } from './services/orderProduct.service'

export const orderProviders = [
  OrderService,
  OrderProductService,
  CartItemService,
  CartService,
  ProductService,
  ImageService,
  ImageAbleService,
  CategoryAbleService,
  TagAbleService,
  TagService,
  CategoryService,
]
