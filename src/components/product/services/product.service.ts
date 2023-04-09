import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { ImageService } from '@imageModule/services/image.service'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { Injectable } from '@nestjs/common'
import { QueryParams } from '@shared/interfaces/request.interface'
import { BaseService } from '@sharedServices/base.service'

import { AbleType } from '@shared/entities/base.entity'
import { Entity } from '@shared/interfaces/response.interface'
import { TagService } from '@tagModule/services/tag.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { assign, isNil } from 'lodash'
import slugify from 'slugify'
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
    private imageService: ImageService,
    private imageAbleService: ImageAbleService,
    private categoryService: CategoryAbleService,
    private categoryAbleService: CategoryAbleService,
    private tagAbleService: TagAbleService,
    private tagService: TagService,
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
    const tagsAvailable = await this.tagService.findIdInOrFail(data.tagIds)
    const categoriesAvailable = await this.categoryService.findIdInOrFail(
      data.categoryIds,
    )
    const imagesAvailable = await this.imageService.findIdInOrFail(
      data.imageIds,
    )

    const countProduct = await this.count({
      where: {
        name: data.name,
      },
    })

    const dataToSave = assign(data, {
      slug: slugify(data.name.toLowerCase()),
    })

    if (countProduct) dataToSave.slug = `${dataToSave.slug}-${countProduct}`

    data.sku = data.sku || `MH${Date.now()}`

    const product: ProductEntity = await this.repository.create(dataToSave)

    // imageAble
    const imageAbleData = imagesAvailable.map((image: any) => ({
      imageId: image.id,
      ableId: product.id,
      ableType: AbleType.product,
    }))
    await this.imageAbleService.attachImageAble(imageAbleData)

    // categoryAble
    const categoryAbleData = categoriesAvailable.map((category: any) => ({
      categoryId: category.id,
      ableId: product.id,
      ableType: AbleType.product,
    }))

    await this.categoryAbleService.attachCategoryAble(categoryAbleData)

    // tagAble
    const tagsAbleData = tagsAvailable.map((tag: any) => ({
      tagId: tag.id,
      ableId: product.id,
      ableType: AbleType.product,
    }))
    await this.tagAbleService.attachTagAble(tagsAbleData)

    return product
  }

  /**
   * Update product and update relation foreign key
   * @param params.id
   * @param params.data UpdateProductDto
   */
  async updateProduct(params: {
    id: number
    data: UpdateProductDto
  }): Promise<void> {
    const { id, data } = params

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

    const dataToUpdate = assign(data, { slug: slugify(data.name) })

    const count = await this.count({
      where: {
        name: data.name,
        slug: dataToUpdate.slug,
      },
    })

    if (currentProduct.name === data.name) {
      delete dataToUpdate.slug
    } else if (count) {
      dataToUpdate.slug = `${dataToUpdate.slug}-${count}`
    }

    await this.update(id, dataToUpdate)
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
