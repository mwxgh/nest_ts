import { Injectable } from '@nestjs/common'
import { BaseService } from 'src/shared/services/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { ProductEntity } from '../entities/product.entity'
import { ProductRepository } from '../repositories/product.repository'
import slugify from 'slugify'
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity'
import { ImageAbleType } from '../../image/entities/imageAble.entity'
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { ImageService } from 'src/components/image/services/image.service'
import { CategoryAbleService } from 'src/components/category/services/categoryAble.service'
import { TagAbleService } from 'src/components/tag/services/tagAble.service'
import { TagAbleType } from 'src/components/tag/entities/tagAble.entity'
import { TagService } from 'src/components/tag/services/tag.service'
import { SortType } from 'src/shared/constant/constant'
import { assign } from 'lodash'

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>
  public entity: any = ProductEntity

  constructor(
    private connection: Connection,
    private imagesService: ImageService,
    private categoryAbleService: CategoryAbleService,
    private tagAbleService: TagAbleService,
    private tagService: TagService,
    private categoryService: CategoryAbleService,
  ) {
    super()
    this.repository = this.connection.getCustomRepository(ProductRepository)
  }

  async queryProduct(params: {
    entity: string
    fields?: string[]
    keyword?: string | ''
    sortBy?: string
    sortType?: SortType
    includes?: string[]
  }): Promise<SelectQueryBuilder<ProductEntity>> {
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

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    const tagsAvailable = await this.tagService.findIdInOrFail(data.tagIds)
    const categoriesAvailable = await this.categoryService.findIdInOrFail(
      data.categoryIds,
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

    // sync with sample tagAble, categoryAble
    // if (data.images) {
    //   data.images.forEach(async (item: any) => {
    //     if (item.url) {
    //       const img = {
    //         url: item.url,
    //         imageAbleId: product.id,
    //         imageAbleType: ImageAbleType.product,
    //       };
    //       await this.imagesService.save(img);
    //     }
    //   });
    // }

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

    // tag & tagAble
    if (data.tagIds && data.tagIds.length > 0) {
      await this.tagAbleService.updateRelationTagAble({
        tagAbleId: currentProduct.id,
        tagAbleType: TagAbleType.product,
        tagIds: data.tagIds,
      })
    }

    // category & categoryAble
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.categoryAbleService.updateRelationCategoryAble({
        categoryAbleId: currentProduct.id,
        categoryAbleType: CategoryAbleType.product,
        categoryIds: data.categoryIds,
      })
    }

    // if (data.images) {
    //   data.images.forEach(async (item) => {
    //     if (item['url']) {
    //       const img = {
    //         url: item['url'],
    //         imageAbleId: currentProduct.id,
    //         imageAbleType: ImageAbleType.product,
    //       };
    //       await this.imagesService.create(img);
    //     }
    //   });
    // }

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

    await this.destroy(currentProduct.id)
  }
}
