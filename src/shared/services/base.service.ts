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
import { DEFAULT_SORT_BY, DEFAULT_SORT_TYPE } from '../constant/constant';

const defaultPaginationOption: IPaginationOptions = {
  limit: 10,
  page: 1,
};

export class BaseService {
  public repository: Repository<any>;
  public entity: any;
  public alias = 'alias';

  async get<T>(): Promise<T[]> {
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
  async paginate<T>(
    queryBuilder: Repository<T> | SelectQueryBuilder<T> | null,
    options: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const query =
      queryBuilder instanceof SelectQueryBuilder
        ? queryBuilder
        : this.repository.createQueryBuilder(this.alias);

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
  async findOneOrFail(
    id: string | number,
    options?: { relations: string[] },
  ): Promise<any> {
    const item = await this.repository.findOne(id, options);
    if (!item) {
      throw new BadRequestException(`Resource not found`);
    }
    return item;
  }

  /**
   * Get the items record in array ids
   *
   * @param ids string[] | number[]
   */
  async findIdInOrFail(ids: string[] | number[]): Promise<any> {
    const items = await this.repository.findByIds(ids);
    if (!items) {
      throw new BadRequestException('Resources not found');
    }
    return items;
  }

  /**
   * Get all items record or throw error if not any
   * @returns entity | error
   */
  async findAllOrFail() {
    const items = await this.repository.find();

    if (!items) {
      throw new BadRequestException('Resource not found');
    }
    return items;
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
   * Saves a given entity in the database.
   *
   * @param data
   *
   * @returns save data
   */
  async save(data: { [key: string]: any }): Promise<any> {
    await this.repository.save(data);
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
   * Destroy the models for the given criteria
   *
   * @param criteria string | string[] | number | number[]
   */
  async destroy(
    criteria: string | string[] | number | number[],
  ): Promise<void> {
    await this.repository.delete(criteria);
  }

  /**
   * Create query builder with search field in entity
   *
   * @params {
   *        entity string,
   *        fields string[] | null,
   *        keyword string | null
   *        }
   */
  async queryBuilder<T>(params: {
    entity: string;
    fields?: string[];
    keyword?: string | '';
    sortBy?: string;
    sortType?: 'ASC' | 'DESC';
    filter?: { [key: string]: string };
  }): Promise<SelectQueryBuilder<T>> {
    const { entity, fields, keyword } = params;

    const orderBy = params.sortBy ? params.sortBy : DEFAULT_SORT_BY;

    const orderType = params.sortType ? params.sortType : DEFAULT_SORT_TYPE;

    let baseQuery = this.repository.createQueryBuilder(`${entity}`);

    if (keyword && keyword !== '' && fields) {
      for (const field of fields) {
        baseQuery = baseQuery.where(`${entity}.${field}  LIKE :keyword`, {
          keyword: `%${keyword}%`,
        });
      }
    }

    baseQuery = baseQuery.orderBy(`${entity}.${orderBy}`, orderType);

    if (orderBy !== DEFAULT_SORT_BY) {
      baseQuery = baseQuery.addOrderBy(
        `${entity}.${DEFAULT_SORT_BY}`,
        DEFAULT_SORT_TYPE,
      );
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
