import { Transformer } from '../../../shared/transformers/transformer';
import { Contact } from '../entities/contact.entity';

export class ContactTransformer extends Transformer {
  transform(model: Contact): any {
    return {
      id: model.id,
      email: model.email,
      phone: model.phone,
      address: model.address,
      note: model.note,
      status: model.status,
    };
  }
}
