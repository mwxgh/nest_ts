import { Injectable } from '@nestjs/common'
import { QueryParams } from '@shared/interfaces/request.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { TagEntity } from '../entities/tag.entity'
import { TagRepository } from '../repositories/tag.repository'
import { Entity } from '@shared/interfaces/response.interface'

@Injectable()
export class TagService extends BaseService {
  public repository: Repository<TagEntity>
  public entity: Entity = TagEntity
  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(TagRepository)
  }

  async queryTag(params: QueryParams) {
    const { entity, fields, keyword, sortBy, sortType } = params

    const baseQuery = await this.queryBuilder({
      entity,
      fields,
      keyword,
      sortBy,
      sortType,
    })

    const tagQuery = baseQuery
      .leftJoinAndSelect('tags.tagAbles', 'tagAbles')
      .leftJoinAndSelect('tagAbles.post', 'posts')
      .leftJoinAndSelect('tagAbles.product', 'products')

    return tagQuery
  }
}
