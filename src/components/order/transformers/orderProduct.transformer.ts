import { ProductTransformer } from '@productModule/transformers/product.transformer'
import { Transformer } from '@shared/transformers/transformer'
import { OrderProductEntity } from '../entities/orderProduct.entity'
import { ResponseEntity } from '@shared/interfaces/response.interface'

export class OrderProductTransformer extends Transformer {
  transform(model: OrderProductEntity): ResponseEntity {
    return model
  }

  includeProduct(model): any {
    return this.item(model, new ProductTransformer())
  }
}
