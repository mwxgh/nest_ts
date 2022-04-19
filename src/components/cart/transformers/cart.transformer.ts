import { Transformer } from 'src/shared/transformers/transformer';
import { Cart } from '../entities/cart.entity';

export class CartTransformer extends Transformer {
  transform(data: Cart) {
    return data;
  }
}
