import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { difference } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryAbleEntity } from '../entities/categoryAble.entity'
import { CategoryAbleRepository } from '../repositories/categoryAble.repository'
import { CategoryService } from './category.service'

@Injectable()
export class CategoryAbleService extends BaseService {
  public categoryAbleRepository: Repository<CategoryAbleEntity>
  public entity: Entity = CategoryAbleEntity
  constructor(
    private connection: Connection,
    private categoryService: CategoryService,
  ) {
    super()
    this.categoryAbleRepository = this.connection.getCustomRepository(
      CategoryAbleRepository,
    )
  }

  /**
   * Attach categoryAble when crate or update product, post, ...
   * @param params.categoryId number
   * @param params.ableId number
   * @param params.ableType CategoryAbleType
   */
  async attachCategoryAble(
    params: {
      categoryId: number
      ableId: number
      ableType: AbleType
    }[],
  ): Promise<void> {
    params.forEach(async (param: any) => {
      const { categoryId, ableId, ableType } = param

      const categoryAble = new CategoryAbleEntity()

      categoryAble.categoryId = categoryId
      categoryAble.ableId = ableId
      categoryAble.ableType = ableType

      await this.categoryAbleRepository.save(categoryAble)
    })
  }

  /**
   * Detach categoryAble when delete category
   * All product, post, ... need to remove foreign key to this category
   * @param params.categoryId number
   */
  async detachCategoryAble(params: { categoryId: number }[])

  /**
   * Detach categoryAble when delete product, post, ...
   * Some category need to remove foreign key to this product, post
   * @param params.ableId
   * @param params.ableType
   */
  async detachCategoryAble(params: { ableId: number; ableType: AbleType }[])

  /**
   * Detach categoryAble
   * @param params.categoryId
   * @param params.ableId
   * @param params.ableType
   * - Detach categoryAble when delete category -> All product, post, ... need to remove foreign key to this category
   * - Detach categoryAble when delete product, post, ... -> Some category need to remove foreign key to this product, post
   */
  async detachCategoryAble(
    params: {
      categoryId?: number
      ableId?: number
      ableType?: AbleType
    }[],
  ): Promise<void> {
    const categoryAbleIdsExisting: number[] = await this.findWhere(params, [
      'id',
    ])

    if (categoryAbleIdsExisting.length > 0) {
      await this.categoryAbleRepository.delete(categoryAbleIdsExisting)
    }
  }

  /**
   * Update relation categoryAble when update product, post, ...
   * @param params.categoryId
   * @param params.ableId
   * @param params.ableType
   */
  async updateRelationCategoryAble(params: {
    categoryIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    const { categoryIds, ableId, ableType } = params

    const currentCategoryIds: number[] = await this.findWhere(
      {
        ableId,
        ableType,
      },
      ['categoryId'],
    )

    if (currentCategoryIds.length === 0) {
      return
    }

    // detach categoryAble
    const detachCategoryIds: number[] = difference(
      currentCategoryIds,
      categoryIds,
    )

    const categoryAbles = detachCategoryIds.map((ableId) => ({
      ableId,
      ableType,
    }))

    await this.detachCategoryAble(categoryAbles)

    // attach new categoryAble
    const newAttachCategoryIds: number[] = difference(
      categoryIds,
      currentCategoryIds,
    )

    const existingCategories = await this.categoryService.findIdInOrFail(
      newAttachCategoryIds,
    )

    const categoriesAbleData = existingCategories.map(
      (category: CategoryEntity) => ({
        categoryId: category.id,
        ableId,
        ableType,
      }),
    )

    await this.attachCategoryAble(categoriesAbleData)
  }
}
