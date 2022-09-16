import { CartService } from '../cart/services/cart.service'
import { CartItemService } from '../cart/services/cartItem.service'
import { CategoryService } from '../category/services/category.service'
import { CategoryAbleService } from '../category/services/categoryAble.service'
import { ImageService } from '../image/services/image.service'
import { ProductService } from '../product/services/product.service'
import { TagService } from '../tag/services/tag.service'
import { TagAbleService } from '../tag/services/tagAble.service'
import { OrderService } from './services/order.service'
import { OrderProductService } from './services/orderProduct.service'

export const orderProviders = [
  OrderService,
  OrderProductService,
  CartItemService,
  CartService,
  ProductService,
  ImageService,
  CategoryAbleService,
  TagAbleService,
  TagService,
  CategoryService,
]
