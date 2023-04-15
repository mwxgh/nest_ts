import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { CreateTagDto } from '@tagModule/dto/tag.dto'
import { Connection, Repository } from 'typeorm'
import { TagEntity } from '../entities/tag.entity'
import { TagRepository } from '../repositories/tag.repository'
import { TagAbleService } from './tagAble.service'

@Injectable()
export class TagService extends BaseService {
  public repository: Repository<TagEntity>
  public entity: Entity = TagEntity
  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => TagAbleService))
    private tagAble: TagAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(TagRepository)
  }

  async createTag(data: CreateTagDto): Promise<TagEntity> {
    await this.checkConflict({ where: { name: data.name } })

    return this.create(data)
  }

  async deleteTag(id: number): Promise<void> {
    await this.checkExisting({ where: { id } })

    await this.tagAble.detachTagAble([{ tagId: id }])

    await this.destroy(id)
  }
}
