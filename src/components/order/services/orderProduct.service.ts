import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { OrderProductEntity } from '../entities/orderProduct.entity'

import { OrderProductRepository } from '../repositories/orderProduct.repository'

@Injectable()
export class OrderProductService extends BaseService {
  public repository: Repository<any>
  public entity: any = OrderProductEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(
      OrderProductRepository,
    )
  }
}
