import {
  Repository,
  getManager,
  SelectQueryBuilder,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isArray, omit, filter, keys, isUndefined } from 'lodash';
import { IPaginationOptions, Pagination } from './pagination';
import { default as slugify } from 'slugify';

const defaultPaginationOption: IPaginationOptions = {
  limit: 10,
  page: 1,
};

export class BaseService {
  public repository: Repository<any>;
  public entity: any;
  public alias = 'alias';

  async get(): Promise<any[]> {
    return this.repository.find();
  }

  private resolveOptions(options: IPaginationOptions): [number, number] {
    const page = options.page;
    const limit = options.limit;

    return [page, limit];
  }

  private async paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const [page, limit] = this.resolveOptions(options);

    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return this.createPaginationObject<T>(items, total, page, limit);
  }

  private createPaginationObject<T>(
    items: T[],
    totalItems: number,
    currentPage: number,
    limit: number,
  ) {
    const totalPages = Math.ceil(totalItems / limit);

    return new Pagination(items, {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: currentPage,
    });
  }

  /**
   * Get the pagination record matching the attributes
   *
   * @param queryBuilder Repository | SelectQueryBuilder | null
   * @param options IPaginationOptions
   */
  async paginate(
    queryBuilder: Repository<any> | SelectQueryBuilder<any> | null,
    options: IPaginationOptions,
  ): Promise<Pagination<any>> {
    let query: any;
    if (!queryBuilder) {
      query = this.repository.createQueryBuilder(this.alias);
    } else {
      query = queryBuilder;
    }
    options = omit(
      options,
      filter(keys(options), function (key) {
        return isUndefined(options[key]);
      }),
    );
    options = { ...defaultPaginationOption, ...options };
    return this.paginateQueryBuilder(query, options);
  }

  /**
   * Get the item record with relation matching the attributes
   *
   * @param id string | number
   * @param options relations
   */
  async find(
    id: string | number,
    options?: { relations: string[] },
  ): Promise<any> {
    return this.repository.findOne(id, options);
  }

  /**
   * Get all items record or throw error if not any
   * @returns entity | error
   */
  async findAllOrFail() {
    const items = await this.repository.find();

    if (items) {
      return items;
    } else {
      throw new BadRequestException('Resource not found');
    }
  }

  /**
   * Get the item record matching the attributes or throw error
   *
   * @param id
   *
   * @returns entity | error
   */
  async findOrFail(id: string | number): Promise<any> {
    const item = await this.repository.findOne(id);
    if (item) {
      return item;
    } else {
      throw new BadRequestException('Resource not found');
    }
  }

  /**
   * Save a new model and return the instance.
   *
   * @param data
   *
   * @returns data save to entity
   */
  async create(data: { [key: string]: any }): Promise<any> {
    const manager = getManager();
    const item = await this.repository.create(data);
    await manager.save(this.entity, item);
    return item;
  }

  /**
   * Get the first record matching the attributes or create it
   *
   * @param options FindOneOptions
   * @param values
   */
  async firstOrCreate(
    options: FindOneOptions,
    values: { [key: string]: any },
  ): Promise<any> {
    let item: any;
    const items = await this.repository.find({ ...options, ...{ take: 1 } });
    if (!isArray(items) || items.length === 0) {
      item = await this.create(values);
    } else {
      item = items[0];
    }
    return item;
  }

  /**
   * Execute the query and get the first result
   *
   * @param options FindOneOptions
   */
  async first(options: FindOneOptions): Promise<any> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } });
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    } else {
      return null;
    }
  }

  /**
   * Execute the query and get the first result or throw an exception
   *
   * @param options FindOneOptions
   */
  async firstOrFail(options: FindOneOptions): Promise<any> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } });
    if (!Array.isArray(items) || items.length === 0) {
      throw new NotFoundException('Resource');
    }
    return items[0];
  }

  /**
   * Update an entity in repository by id
   *
   * @param id number | string
   * @param data object
   */
  async update(
    id: number | string,
    data: { [key: string]: any },
  ): Promise<any> {
    const manager = getManager();
    const item = await this.repository.findOne(id);
    const result = await manager.save(this.entity, { ...item, ...data });
    return result;
  }

  /**
   * Create or update a related record matching the attributes, and fill it with values.
   *
   * @param attributes object
   * @param values object
   *
   * @return entity
   */
  async updateOrCreate(
    attributes: { [key: string]: any },
    values: { [key: string]: any },
  ): Promise<any> {
    let item: any;
    const items = await this.repository.find({ where: attributes, take: 1 });
    if (!isArray(items) || items.length === 0) {
      item = await this.create(values);
    } else {
      item = await this.update(items[0].id, values);
    }
    return item;
  }

  /**
   * Get list of record matching the attributes condition
   *
   * @param condition FindManyOptions
   * @param columns string[] | null
   *
   * @returns entity
   */
  async findWhere(
    condition: FindManyOptions,
    columns?: string[],
  ): Promise<any> {
    return this.repository.find({
      where: condition,
      select: columns,
    });
  }

  /**
   * Return number of record that match criteria
   *
   * @param options
   */
  async count(options: FindManyOptions): Promise<any> {
    return await this.repository.count(options);
  }

  /**
   * Destroy the models for the given ID
   *
   * @param id Number | String
   */
  async destroy(id: number | string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Create query builder with search field in entity
   *
   * @param entity string
   * @param keyword string | null
   * @param fields string[] | null
   */
  async queryBuilder(
    entity: string,
    fields?: string[],
    keyword?: string | '',
  ): Promise<any> {
    let baseQuery = this.repository.createQueryBuilder(`${entity}`);
    if (keyword && keyword !== '' && fields) {
      for (const field of fields) {
        baseQuery = baseQuery.where(`${entity}.${field}  LIKE :keyword`, {
          keyword: `%${keyword}%`,
        });
      }
    }
    return baseQuery;
  }

  /**
   * Generate slug
   *
   * @param name string
   *
   * @return string
   */
  async generateSlug(name: string): Promise<string> {
    const makeId = (length: number): string => {
      let result = '';
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    };
    let i = 0;
    let slug = slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
    });
    let s = slug;
    while (true) {
      i++;
      if (i == 100) break;
      const count = await this.count({ where: { slug: s } });
      if (count === 0) {
        slug = s;
        break;
      } else {
        s = `${slug}-${makeId(8)}`;
      }
    }
    return slug;
  }
}
