import { Transformer } from '../../../shared/transformers/transformer';
import { OrderEntity } from '../entities/order.entity';

export class OrderTransformer extends Transformer {
  transform(model: OrderEntity): any {
    return model;
  }
}
