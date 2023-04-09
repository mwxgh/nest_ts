import { ProductTransformer } from '@productModule/transformers/product.transformer'
import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { OrderProductEntity } from '../entities/orderProduct.entity'

export class OrderProductTransformer extends Transformer {
  transform(model: OrderProductEntity): ResponseEntity {
    return model
  }

  includeProduct(model): any {
    return this.item(model, new ProductTransformer())
  }
}
