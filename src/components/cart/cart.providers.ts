import { ProductService } from '../product/services/product.service';
import { CartService } from './services/cart.service';
import { CartItemService } from './services/cartItem.service';

export const cartProviders = [CartService, CartItemService, ProductService];
