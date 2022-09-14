import { CommonService } from 'src/shared/services/common.service';
import { CategoryAbleService } from '../category/services/categoryAble.service';
import { ImageService } from '../image/services/image.service';
import { ProductService } from '../product/services/product.service';
import { TagService } from '../tag/services/tag.service';
import { TagAbleService } from '../tag/services/tagAble.service';
import { CartService } from './services/cart.service';
import { CartItemService } from './services/cartItem.service';

export const cartProviders = [
  CartService,
  CartItemService,
  ProductService,
  ImageService,
  CategoryAbleService,
  CommonService,
  TagAbleService,
  TagService,
];
