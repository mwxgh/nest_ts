import { Transformer } from '../../../shared/transformers/transformer';
import { Contact } from '../entities/contact.entity';

export class ContactTransformer extends Transformer {
  transform(contact: Contact): any {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      note: contact.note,
      status: contact.status,
    };
  }
}
