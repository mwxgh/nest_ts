import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CartItemEntity } from '../entities/cartItem.entity'
import { CartItemRepository } from '../repositories/cartItem.repository'
import { Entity } from '@shared/interfaces/response.interface'
@Injectable()
export class CartItemService extends BaseService {
  public repository: Repository<CartItemEntity>
  public entity: Entity = CartItemEntity
  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CartItemRepository)
  }
}
