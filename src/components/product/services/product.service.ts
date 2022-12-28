import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { ProductEntity } from '../entities/product.entity'
import { ProductRepository } from '../repositories/product.repository'
import slugify from 'slugify'
import { CategoryAbleType } from '@categoryModule/entities/categoryAble.entity'
import { ImageAbleType } from '@imageModule/entities/imageAble.entity'
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { ImageService } from '@imageModule/services/image.service'
import { CategoryAbleService } from '@categoryModule/services/categoryAble.service'
import { TagAbleService } from '@tagModule/services/tagAble.service'
import { TagAbleType } from '@tagModule/entities/tagAble.entity'
import { TagService } from '@tagModule/services/tag.service'
import { assign } from 'lodash'
import { ImageAbleService } from '@imageModule/services/imageAble.service'
import { QueryParams } from '@shared/interfaces/interface'

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>
  public entity: any = ProductEntity

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
  ): Promise<SelectQueryBuilder<ProductEntity>> {
    const { entity, fields, keyword, sortBy, sortType, includes } = params

    let queryBuilder: SelectQueryBuilder<ProductEntity> =
      await this.queryBuilder({
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      })

    if (includes.length > 0) {
      if (includes.includes('images')) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          'products.images',
          'images',
          'images.imageAbleType = :imageAbleType',
          { imageAbleType: ImageAbleType.product },
        )
      }
      if (includes.includes('categories')) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          'products.categories',
          'categories',
          'categories.categoryAbleType = :categoryAbleType',
          { categoryAbleType: CategoryAbleType.product },
        )
      }
      if (includes.includes('tags')) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          'products.tags',
          'tags',
          'tags.tagAbleType = :tagAbleType',
          { tagAbleType: TagAbleType.product },
        )
      }
    }

    return queryBuilder
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
      imageAbleId: product.id,
      imageAbleType: ImageAbleType.product,
    }))
    await this.imageAbleService.attachImageAble(imageAbleData)

    // categoryAble
    const categoryAbleData = categoriesAvailable.map((category: any) => ({
      categoryId: category.id,
      categoryAbleId: product.id,
      categoryAbleType: CategoryAbleType.product,
    }))

    await this.categoryAbleService.attachCategoryAble(categoryAbleData)

    // tagAble
    const tagsAbleData = tagsAvailable.map((tag: any) => ({
      tagId: tag.id,
      tagAbleId: product.id,
      tagAbleType: TagAbleType.product,
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

    const currentProduct = await this.findOneOrFail(id)

    // tagAble
    if (data.tagIds && data.tagIds.length > 0) {
      await this.tagAbleService.updateRelationTagAble({
        tagAbleId: currentProduct.id,
        tagAbleType: TagAbleType.product,
        tagIds: data.tagIds,
      })
    }

    // categoryAble
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.categoryAbleService.updateRelationCategoryAble({
        categoryAbleId: currentProduct.id,
        categoryAbleType: CategoryAbleType.product,
        categoryIds: data.categoryIds,
      })
    }

    // imageAble
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageAbleService.updateRelationImageAble({
        imageAbleId: currentProduct.id,
        imageAbleType: ImageAbleType.product,
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
  async deleteProduct(params: { id: number }): Promise<void> {
    const { id } = params

    const currentProduct = await this.findOneOrFail(id)

    await this.tagAbleService.detachTagAble([
      {
        tagAbleId: currentProduct.id,
        tagAbleType: TagAbleType.product,
      },
    ])

    await this.categoryAbleService.detachCategoryAble([
      {
        categoryAbleId: currentProduct.id,
        categoryAbleType: CategoryAbleType.product,
      },
    ])

    await this.imageAbleService.detachImageAble([
      {
        imageAbleId: currentProduct.id,
        imageAbleType: ImageAbleType.product,
      },
    ])

    await this.destroy(currentProduct.id)
  }
}
