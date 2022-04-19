import { Transformer } from '../../../shared/transformers/transformer';
import { Order } from '../entities/order.entity';

export class OrderTransformer extends Transformer {
  transform(model: Order): any {
    return model;
  }
}
