import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CartItemEntity } from '../entities/cartItem.entity'
import { CartItemRepository } from '../repositories/cartItem.repository'
@Injectable()
export class CartItemService extends BaseService {
  public repository: Repository<any>
  public entity: any = CartItemEntity
  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CartItemRepository)
  }
}
