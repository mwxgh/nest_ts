import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { difference } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { CategoryAbleEntity } from '../entities/categoryAble.entity'
import { CategoryAbleRepository } from '../repositories/categoryAble.repository'
import { CategoryService } from './category.service'

@Injectable()
export class CategoryAbleService extends BaseService {
  public repository: Repository<CategoryAbleEntity>
  public entity: Entity = CategoryAbleEntity
  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => CategoryService))
    private category: CategoryService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(
      CategoryAbleRepository,
    )
  }

  /**
   * Attach categoryAble when crate or update product, post, ...
   * @param params.categoryIds number[]
   * @param params.ableId number
   * @param params.ableType AbleType
   */
  async attachCategoryAble({
    categoryIds,
    ableId,
    ableType,
  }: {
    categoryIds: number[]
    ableId: number
    ableType: AbleType
  }): Promise<void> {
    categoryIds.map(async (categoryId) => {
      await this.category.checkExisting({ where: { id: categoryId } })

      await this.save({ categoryId, ableId, ableType })
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
    const categoryAble: number[] = await this.findWhere(params, ['id'])

    if (categoryAble.length > 0) {
      await this.destroy(categoryAble)
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

    await this.attachCategoryAble({
      categoryIds: newAttachCategoryIds,
      ableId,
      ableType,
    })
  }
}
