import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CartEntity } from '../entities/cart.entity'
import { CartRepository } from '../repositories/cart.repository'
import { Entity } from '@shared/interfaces/response.interface'
@Injectable()
export class CartService extends BaseService {
  public repository: Repository<CartEntity>
  public entity: Entity = CartEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CartRepository)
  }

  async store(): Promise<any> {
    return this.repository.save({})
  }
}
