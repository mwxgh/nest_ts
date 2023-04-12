import {
  CreateContactDto,
  UpdateContactDto,
} from '@contactModule/dto/contact.dto'
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

  /**
   * Create new contact by themselves
   *
   * @param param.currentUser Me
   * @param param.data CreateContactDto
   *
   * @returns ContactEntity
   */
  async createContact({
    currentUser,
    data,
  }: {
    currentUser: Me
    data: CreateContactDto
  }): Promise<ContactEntity> {
    const userId: number = currentUser.id
    const count = await this.count({ where: { userId } })

    if (data.type === ContactType.priority && count > 0) {
      await this.bulkUpdate({ where: { userId } }, { type: ContactType.normal })
    }

    Object.assign(data, { userId })

    return this.create(data)
  }

  /**
   * Get contact detail by themselves
   *
   * @param param.id number
   * @param param.currentUser Me
   *
   * @returns ContactEntity
   */
  async getSelfDetailContact({
    id,
    currentUser,
  }: {
    id: number
    currentUser: Me
  }): Promise<ContactEntity> {
    const contact: ContactEntity = await this.findOneOrFail(id)

    this.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    return contact
  }

  /**
   * Update exist contact by themselves or administrator
   *
   * @param param.id number
   * @param param.currentUser Me
   * @param param.data UpdateContactDto
   *
   * @returns ContactEntity
   */
  async updateContact({
    id,
    currentUser,
    data,
  }: {
    id: number
    currentUser: Me
    data: UpdateContactDto
  }): Promise<ContactEntity> {
    const userId: number = currentUser.id
    const contact: ContactEntity = await this.findOneOrFail(id)

    this.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    if (data.type === ContactType.priority) {
      await this.bulkUpdate({ where: { userId } }, { type: ContactType.normal })
    }

    return this.update(id, data)
  }

  /**
   * Delete exist contact by themselves or administrator
   *
   * @param param.id number
   * @param param.currentUser Me
   * @param param.data UpdateContactDto
   *
   * @returns ContactEntity
   */
  async deleteContact({
    id,
    currentUser,
  }: {
    id: number
    currentUser: Me
  }): Promise<void> {
    const contact: ContactEntity = await this.findOneOrFail(id)

    this.checkUserPermissionOperation({
      currentUser,
      userId: contact.userId,
    })

    await this.destroy(id)
  }
}
