import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { CreateTagDto } from '@tagModule/dto/tag.dto'
import { Connection, Repository } from 'typeorm'
import { TagEntity } from '../entities/tag.entity'
import { TagRepository } from '../repositories/tag.repository'

@Injectable()
export class TagService extends BaseService {
  public repository: Repository<TagEntity>
  public entity: Entity = TagEntity
  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(TagRepository)
  }

  async createTag(data: CreateTagDto): Promise<TagEntity> {
    await this.checkConflict({ where: { name: data.name } })

    return this.create(data)
  }
}
