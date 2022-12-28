import { Transformer } from '@shared/transformers/transformer'
import { CartEntity } from '../entities/cart.entity'

export class CartTransformer extends Transformer {
  transform(data: CartEntity) {
    return data
  }
}
