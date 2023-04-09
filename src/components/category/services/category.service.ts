import { CreateCategoryDto } from '@categoryModule/dto/category.dto'
import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { QueryParams } from '@shared/interfaces/request.interface'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { isNil } from 'lodash'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryRepository } from '../repositories/category.repository'

@Injectable()
export class CategoryService extends BaseService {
  public repository: Repository<CategoryEntity>
  public entity: Entity = CategoryEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CategoryRepository)
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryEntity> {
    await this.checkConflict({ where: { name: data.name } })
    return this.create(data)
  }

  async queryCategory(
    params: QueryParams,
  ): Promise<[SelectQueryBuilder<CategoryEntity>, string[]]> {
    const { entity, fields, keyword, sortBy, sortType, includes, relations } =
      params

    let [baseQuery]: [SelectQueryBuilder<CategoryEntity>, string[]] =
      await this.queryBuilder({
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      })

    let includesParams = undefined

    if (!isNil(includes) && !isNil(relations)) {
      includesParams = Array.isArray(includes) ? includes : [includes]

      this.checkIncludeParam({
        includesParams,
        relations,
      })

      if (includesParams.length > 0) {
        if (includesParams.includes('products')) {
          baseQuery = baseQuery.leftJoinAndSelect(
            `${entity}.products`,
            `products`,
            `products.ableType = :ableType`,
            {
              ableType: AbleType.product,
            },
          )
        }

        if (includesParams.includes('posts')) {
          baseQuery = baseQuery.leftJoinAndSelect(
            `${entity}.posts`,
            `posts`,
            `posts.ableType = :ableType`,
            {
              ableType: AbleType.post,
            },
          )
        }
      }
    }

    return [baseQuery, includesParams]
  }
}
