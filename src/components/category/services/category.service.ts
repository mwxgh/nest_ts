import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@categoryModule/dto/category.dto'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { QueryParams } from '@shared/interfaces/request.interface'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { isNil } from 'lodash'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryRepository } from '../repositories/category.repository'
import { CategoryAbleService } from './categoryAble.service'

@Injectable()
export class CategoryService extends BaseService {
  public repository: Repository<CategoryEntity>
  public entity: Entity = CategoryEntity

  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => CategoryAbleService))
    private categoryAble: CategoryAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(CategoryRepository)
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryEntity> {
    await this.checkConflict({ where: { name: data.name } })

    return this.create(data)
  }

  async updateCategory({
    id,
    data,
  }: {
    id: number
    data: UpdateCategoryDto
  }): Promise<CategoryEntity> {
    await this.checkExisting({ where: id })

    if (!isNil(data.name)) {
      await this.checkConflict({ where: { name: data.name } })
    }

    return this.update(id, data)
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
          baseQuery = baseQuery
            .leftJoinAndSelect(
              `${entity}.categoryAbles`,
              `categoryAble`,
              `categoryAble.ableType = :ableType`,
              {
                ableType: AbleType.product,
              },
            )
            .leftJoinAndSelect('categoryAble.product', 'product')
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

  async findOneWithChildren(id: number): Promise<CategoryEntity> {
    const category = await this.repository.findOne(id, {
      relations: ['children'],
    })
    return category
  }

  async findAllHierarchical(): Promise<CategoryEntity[]> {
    const categories = await this.repository.find({
      relations: ['children'],
    })
    return this.buildTree(categories)
  }

  private buildTree(
    categories: CategoryEntity[],
    parentId?: number,
  ): CategoryEntity[] {
    const result: CategoryEntity[] = []
    for (const category of categories) {
      if (category.parent?.id === parentId) {
        const children = this.buildTree(categories, category.id)
        if (children.length > 0) {
          category.children = children
        }
        result.push(category)
      }
    }
    return result
  }

  async deleteCategory(id: number): Promise<void> {
    await this.checkExisting({ where: { id } })

    await this.destroy(id)

    await this.categoryAble.detachCategoryAble([{ categoryId: id }])
  }
}
