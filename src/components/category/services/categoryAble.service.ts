import { Injectable } from '@nestjs/common'
import { difference } from 'lodash'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'
import {
  CategoryAbleEntity,
  CategoryAbleType,
} from '../entities/categoryAble.entity'
import { CategoryAbleRepository } from '../repositories/categoryAble.repository'
import { CategoryService } from './category.service'

@Injectable()
export class CategoryAbleService extends BaseService {
  public categoryAbleRepository: Repository<any>
  public entity: any = CategoryAbleEntity
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
   * @param params.categoryAbleId number
   * @param params.categoryAbleType CategoryAbleType
   */
  async attachCategoryAble(
    params: {
      categoryId: number
      categoryAbleId: number
      categoryAbleType: CategoryAbleType
    }[],
  ): Promise<void> {
    params.forEach(async (param: any) => {
      const { categoryId, categoryAbleId, categoryAbleType } = param

      const categoryAble = new CategoryAbleEntity()

      categoryAble.categoryId = categoryId
      categoryAble.categoryAbleId = categoryAbleId
      categoryAble.categoryAbleType = categoryAbleType

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
   * @param params.categoryAbleId
   * @param params.categoryAbleType
   */
  async detachCategoryAble(
    params: { categoryAbleId: number; categoryAbleType: CategoryAbleType }[],
  )

  /**
   * Detach categoryAble
   * @param params.categoryId
   * @param params.categoryAbleId
   * @param params.categoryAbleType
   * - Detach categoryAble when delete category -> All product, post, ... need to remove foreign key to this category
   * - Detach categoryAble when delete product, post, ... -> Some category need to remove foreign key to this product, post
   */
  async detachCategoryAble(
    params: {
      categoryId?: number
      categoryAbleId?: number
      categoryAbleType?: CategoryAbleType
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
   * @param params.categoryAbleId
   * @param params.categoryAbleType
   */
  async updateRelationCategoryAble(params: {
    categoryIds: number[]
    categoryAbleId: number
    categoryAbleType: CategoryAbleType
  }): Promise<void> {
    const { categoryIds, categoryAbleId, categoryAbleType } = params

    const currentCategoryIds: number[] = await this.findWhere(
      {
        categoryAbleId,
        categoryAbleType,
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

    const categoryAbles = detachCategoryIds.map((categoryAbleId) => ({
      categoryAbleId,
      categoryAbleType,
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
        categoryAbleId,
        categoryAbleType,
      }),
    )

    await this.attachCategoryAble(categoriesAbleData)
  }
}
