import { CreateContactDto } from '@contactModule/dto/contact.dto'
import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Me } from '@userModule/dto/user.dto'
import { Connection, Repository } from 'typeorm'
import { ContactEntity, ContactType } from '../entities/contact.entity'
import { ContactRepository } from '../repositories/contact.repository'

@Injectable()
export class ContactService extends BaseService {
  public repository: Repository<ContactEntity>
  public entity: Entity = ContactEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(ContactRepository)
  }
  async createContact({
    currentUser,
    data,
  }: {
    currentUser: Me
    data: CreateContactDto
  }): Promise<ContactEntity> {
    const userId: number = currentUser.id

    if (data.type === ContactType.priority) {
      await this.update({ where: { userId } }, { type: ContactType.normal })
    }

    Object.assign(data, { userId })

    return this.create(data)
  }
}
