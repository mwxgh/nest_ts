import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity';
import { ImageAbleType } from '../../image/entities/imageAble.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ImageService } from 'src/components/image/services/image.service';
import { CategoryAbleService } from 'src/components/category/services/categoryAble.service';

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>;
  public entity: any = ProductEntity;

  constructor(
    private connection: Connection,
    private imagesService: ImageService,
    private categoryAbleService: CategoryAbleService,
  ) {
    super();
    this.repository = this.connection.getCustomRepository(ProductRepository);
  }

  async queryProduct(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    sortBy?: string;
    sortType?: 'ASC' | 'DESC';
    includes?: string[];
  }): Promise<SelectQueryBuilder<ProductEntity>> {
    const { entity, fields, keyword, sortBy, sortType, includes } = params;

    let queryBuilder: SelectQueryBuilder<ProductEntity> =
      await this.queryBuilder({
        entity,
        fields,
        keyword,
        sortBy,
        sortType,
      });

    if (includes.length > 0) {
      if (includes.includes('images')) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          'products.images',
          'images',
          'images.imageAbleType = :imageAbleType',
          { imageAbleType: ImageAbleType.product },
        );
      }
      if (includes.includes('categories')) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          'products.categories',
          'categories',
          'categories.categoryAbleType = :categoryAbleType',
          { categoryAbleType: CategoryAbleType.product },
        );
        queryBuilder.leftJoinAndSelect('categories.category', 'category');
      }
    }

    return queryBuilder;
  }

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    data.slug = slugify(data.name.toLowerCase());

    const num = await this.repository
      .createQueryBuilder('products')
      .where('products.name = :name', { name: data.name })
      .getCount();

    if (num > 0) data.slug = `${data.slug}-${num}`;

    data.sku = data.sku || `MH${Date.now()}`;

    const product: ProductEntity = await this.repository.create(data);

    if (data.images) {
      data.images.forEach(async (item: any) => {
        if (item.url) {
          const img = {
            url: item.url,
            imageAbleId: product.id,
            imageAbleType: ImageAbleType.product,
          };
          await this.imagesService.save(img);
        }
      });
    }

    if (data.categoryId && data.categoryId != null) {
      const cate = {
        categoryId: data.categoryId,
        categoryAbleId: product.id,
        categoryAbleType: CategoryAbleType.product,
      };
      await this.categoryAbleService.save(cate);
    }
    return product;
  }

  async updateProduct(params: {
    id: number;
    data: UpdateProductDto;
  }): Promise<void> {
    const { id, data } = params;
    await this.findOneOrFail(id);

    const product = await this.update(id, data);

    if (data.images) {
      data.images.forEach(async (item) => {
        if (item['url']) {
          const img = {
            url: item['url'],
            imageAbleId: product.id,
            imageAbleType: ImageAbleType.product,
          };
          await this.imagesService.create(img);
        }
      });
    }

    if (data.categoryId && data.categoryId != null) {
      const cate = {
        categoryId: data.categoryId,
        categoryAbleId: product.id,
        categoryAbleType: CategoryAbleType.product,
      };
      await this.categoryAbleService.create(cate);
    }
  }
}
