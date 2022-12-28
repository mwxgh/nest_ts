import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { ContactEntity } from '../entities/contact.entity'
import { ContactRepository } from '../repositories/contact.repository'

@Injectable()
export class ContactService extends BaseService {
  public repository: Repository<any>
  public entity: any = ContactEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(ContactRepository)
  }
}
