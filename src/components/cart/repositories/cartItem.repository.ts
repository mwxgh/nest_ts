import { EntityRepository, Repository } from 'typeorm';
import { CartItem } from '../entities/cartItem.entity';

@EntityRepository(CartItem)
export class CartItemRepository extends Repository<CartItem> {}
