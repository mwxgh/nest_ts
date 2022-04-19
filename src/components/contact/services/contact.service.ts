import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { ContactRepository } from '../repositories/contact.repository';

@Injectable()
export class ContactService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Contact;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(ContactRepository);
  }
}
