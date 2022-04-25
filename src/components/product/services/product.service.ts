import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { CategoryAbleType } from 'src/components/category/entities/categoryAble.entity';
import { ImageAbleType } from '../../image/entities/imageAble.entity';

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Product;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(ProductRepository);
  }

  async queryInclude(includes: any, id?: any): Promise<any> {
    const key = ['images', 'categories'];

    const include = includes.split(',').filter((item) => key.includes(item));

    let query_builder = id
      ? this.repository
          .createQueryBuilder('products')
          .where('products.id = :id', { id: id })
      : this.repository.createQueryBuilder('products');

    if (include.length > 0) {
      if (include.includes('images')) {
        query_builder = query_builder.leftJoinAndSelect(
          'products.images',
          'images',
          'images.imageAbleType = :imageAbleType',
          { imageAbleType: ImageAbleType.product },
        );
      }
      if (include.includes('categories')) {
        query_builder = query_builder.leftJoinAndSelect(
          'products.categories',
          'categories',
          'categories.categoryAbleType = :categoryAbleType',
          { categoryAbleType: CategoryAbleType.product },
        );
        query_builder.leftJoinAndSelect('categories.category', 'category');
      }
    }

    return { include, query_builder };
  }

  async createProduct(data: any): Promise<any> {
    data.slug = slugify(data.name.toLowerCase());

    const num = await this.repository
      .createQueryBuilder('products')
      .where('products.name = :name', { name: data['name'] })
      .getCount();

    if (num > 0) data.slug = `${data.slug}-${num}`;

    data.sku = data.sku || `MH${Date.now()}`;

    const product = await this.repository.save(data);

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
