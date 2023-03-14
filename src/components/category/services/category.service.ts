import { Injectable } from '@nestjs/common'
import { QueryParams } from '@shared/interfaces/request.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryAbleType } from '../entities/categoryAble.entity'
import { CategoryRepository } from '../repositories/category.repository'
import { Entity } from '@shared/interfaces/response.interface'

@Injectable()
export class CategoryService extends BaseService {
  public repository: Repository<CategoryEntity>
  public entity: Entity = CategoryEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CategoryRepository)
  }

  async queryCategory(
    params: QueryParams & {
      // update include -> string[] in future
      includes?: any
    },
  ): Promise<SelectQueryBuilder<CategoryEntity>> {
    const include = []

    if (params.includes) {
      const arr = params.includes.split(',')
      arr.map((i: any) => include.push(i))
    }

    const { entity, fields, keyword, sortBy, sortType } = params

    let baseQuery: SelectQueryBuilder<CategoryEntity> = await this.queryBuilder(
      {
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      },
    )

    if (include.includes('products')) {
      baseQuery = baseQuery.where(`${entity}.categoryType = :type`, {
        type: CategoryAbleType.product,
      })
    }

    if (include.includes('posts')) {
      baseQuery = baseQuery.where(`${entity}.categoryType = :type`, {
        type: CategoryAbleType.post,
      })
    }
    return baseQuery
  }
}
