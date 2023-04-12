import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { Injectable } from '@nestjs/common'
import { AbleType } from '@shared/entities/base.entity'
import { QueryParams } from '@shared/interfaces/request.interface'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { isNil } from 'lodash'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { ProductEntity } from '../entities/product.entity'
import { ProductRepository } from '../repositories/product.repository'

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<ProductEntity>
  public entity: Entity = ProductEntity

  constructor(
    private connection: Connection,
    private imageAbleService: ImageAbleService,
    private categoryAbleService: CategoryAbleService,
    private tagAbleService: TagAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(ProductRepository)
  }

  /**
   * Build query product with params
   */
  async queryProduct(
    params: QueryParams,
  ): Promise<[SelectQueryBuilder<ProductEntity>, string[]]> {
    const { entity, fields, keyword, sortBy, sortType, includes, relations } =
      params

    let [baseQuery]: [SelectQueryBuilder<ProductEntity>, string[]] =
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

      // query image association
      if (includesParams.includes('images')) {
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.images`,
          'images',
          'images.ableType = :ableType',
          { ableType: AbleType.product },
        )
      }
      // query category association
      if (includesParams.includes('categories')) {
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.categories`,
          'categories',
          'categories.ableType = :ableType',
          { ableType: AbleType.product },
        )
      }
      // query tag association
      if (includesParams.includes('tags')) {
        baseQuery = baseQuery.leftJoinAndSelect(
          `${entity}.tags`,
          'tags',
          'tags.ableType = :ableType',
          { ableType: AbleType.product },
        )
      }
    }

    return [baseQuery, includesParams]
  }

  /**
   * Save product and create relation foreign key
   * @param params.data CreateProductDto
   */
  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    Object.assign(data, { slug: await this.generateSlug(data.name) })

    data.sku = data.sku || `MH${Date.now()}`

    const product: ProductEntity = await this.repository.save(data)

    // imageAble
    if (!isNil(data.imageIds)) {
      await this.imageAbleService.attachImageAble({
        imageIds: data.imageIds,
        ableId: product.id,
        ableType: AbleType.product,
      })
    }

    // categoryAble
    if (!isNil(data.categoryIds)) {
      await this.categoryAbleService.attachCategoryAble({
        categoryIds: data.categoryIds,
        ableId: product.id,
        ableType: AbleType.product,
      })
    }

    // tagAble
    if (!isNil(data.tagIds)) {
      await this.tagAbleService.attachTagAble({
        tagIds: data.tagIds,
        ableId: product.id,
        ableType: AbleType.product,
      })
    }

    return product
  }

  /**
   * Update product and update relation foreign key
   * @param params.id
   * @param params.data UpdateProductDto
   */
  async updateProduct({
    id,
    data,
  }: {
    id: number
    data: UpdateProductDto
  }): Promise<ProductEntity> {
    const currentProduct: ProductEntity = await this.findOneOrFail(id)

    // tagAble
    if (data.tagIds && data.tagIds.length > 0) {
      await this.tagAbleService.updateRelationTagAble({
        ableId: currentProduct.id,
        ableType: AbleType.product,
        tagIds: data.tagIds,
      })
    }

    // categoryAble
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.categoryAbleService.updateRelationCategoryAble({
        ableId: currentProduct.id,
        ableType: AbleType.product,
        categoryIds: data.categoryIds,
      })
    }

    // imageAble
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageAbleService.updateRelationImageAble({
        ableId: currentProduct.id,
        ableType: AbleType.product,
        imageIds: data.categoryIds,
      })
    }

    if (!isNil(data.name)) {
      Object.assign(data, { slug: await this.generateSlug(data.name) })
    }

    return this.update(id, data)
  }

  /**
   * Delete product and detach foreign key
   * @param params.id
   */
  async deleteProduct(id: number): Promise<void> {
    const currentProduct: ProductEntity = await this.findOneOrFail(id)

    await this.tagAbleService.detachTagAble([
      {
        ableId: currentProduct.id,
        ableType: AbleType.product,
      },
    ])

    await this.categoryAbleService.detachCategoryAble([
      {
        ableId: currentProduct.id,
        ableType: AbleType.product,
      },
    ])

    await this.imageAbleService.detachImageAble([
      {
        ableId: currentProduct.id,
        ableType: AbleType.product,
      },
    ])

    await this.destroy(currentProduct.id)
  }
}
