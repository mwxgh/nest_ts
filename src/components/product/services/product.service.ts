import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity';
import { ImageAbleType } from '../../image/entities/imageAble.entity';
import { CreateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Product;

  constructor(private connection: Connection) {
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
  }): Promise<SelectQueryBuilder<Product>> {
    const { entity, fields, keyword, sortBy, sortType, includes } = params;

    let queryBuilder: SelectQueryBuilder<Product> = await this.queryBuilder({
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

  async createProduct(data: CreateProductDto): Promise<Product> {
    data.slug = slugify(data.name.toLowerCase());

    const num = await this.repository
      .createQueryBuilder('products')
      .where('products.name = :name', { name: data.name })
      .getCount();

    if (num > 0) data.slug = `${data.slug}-${num}`;

    data.sku = data.sku || `MH${Date.now()}`;

    const product: Product = await this.repository.save(data);

    if (data.images) {
      data.images.forEach(async (item: any) => {
        if (item.url) {
          const img = {
            url: item.url,
            imageAbleId: product.id,
            imageAbleType: ImageAbleType.product,
          };
          await this.repository.create(img);
        }
      });
    }

    if (data.categoryId && data.categoryId != null) {
      const cate = {
        categoryId: data.categoryId,
        categoryAbleId: product.id,
        categoryAbleType: CategoryAbleType.product,
      };
      await this.repository.save(cate);
    }
    return product;
  }
}
