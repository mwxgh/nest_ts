import { EntityRepository, Repository } from 'typeorm'
import { CartItemEntity } from '../entities/cartItem.entity'

@EntityRepository(CartItemEntity)
export class CartItemRepository extends Repository<CartItemEntity> {}
