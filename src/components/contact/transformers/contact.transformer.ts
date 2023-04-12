import { ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { ContactEntity } from '../entities/contact.entity'

export class ContactTransformer extends Transformer {
  transform(contact: ContactEntity): ResponseEntity {
    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      address: contact.address,
      type: contact.type,
    }
  }
}
