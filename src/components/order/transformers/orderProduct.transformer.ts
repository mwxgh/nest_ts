import { ProductTransformer } from 'src/components/product/transformers/product.transformer';
import { Transformer } from '../../../shared/transformers/transformer';
import { OrderProduct } from '../entities/orderProduct.entity';

export class OrderProductTransformer extends Transformer {
  transform(model: OrderProduct): any {
    return model;
  }

  includeProduct(model): any {
    return this.item(model, new ProductTransformer());
  }
}
