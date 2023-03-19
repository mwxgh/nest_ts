import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  ObjectID,
  Repository,
  SelectQueryBuilder,
  getManager,
} from 'typeorm'
import {
  IPaginationOptions,
  QueryParams,
} from '@shared/interfaces/request.interface'
import { filter, isArray, isUndefined, keys, omit } from 'lodash'
import { default as slugify } from 'slugify'
import { DEFAULT_SORT_BY, DEFAULT_SORT_TYPE } from '../constant/constant'
import {
  Entity,
  Pagination,
  ResponseEntity,
} from '../interfaces/response.interface'
import { PrimitiveService } from './primitive.service'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import Messages from '@shared/message/message'

/**
 * Base service
 * Handling database
 */
export class BaseService extends PrimitiveService {
  public repository: Repository<any>
  public entity: any
  public alias = 'alias'

  /**
   * Save a new model and return the instance.
   *
   * @param data
   * @returns data save to entity
   */
  async create<T>(data: Entity): Promise<T> {
    const item = await this.repository.create(data)

    await getManager().save(this.entity, item)

    return item
  }

  /**
   * Saves a given entity in the database.
   *
   * @param data
   * @returns save data
   */
  async save(data: Entity): Promise<void> {
    await this.repository.save(data)
  }

  /**
   * Get the first record matching the attributes or create it
   *
   * @param options FindOneOptions
   * @param values
   */
  async firstOrCreate(options: FindOneOptions, values: Entity): Promise<any> {
    let item: any

    const items = await this.repository.find({ ...options, ...{ take: 1 } })

    if (!isArray(items) || items.length === 0) {
      item = await this.create(values)
    } else {
      item = items[0]
    }

    return item
  }

  /**
   * Find data of repository.
   *
   * @param none
   * @returns data
   */
  async get<T>(): Promise<T[]> {
    return this.repository.find()
  }

  /**
   * Get all items record or throw error if not any
   *
   * @returns entity | error
   */
  async findAllOrFail(): Promise<ResponseEntity> {
    const items = await this.repository.find()

    if (!items) {
      throw new BadRequestException('Resource not found')
    }

    return items
  }

  /**
   * Execute the query and get the first result
   *
   * @param options FindOneOptions
   *
   * @returns Entity
   */
  async first<T>(options: FindOneOptions): Promise<T> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } })

    if (Array.isArray(items) && items.length !== 0) {
      return items[0]
    } else {
      return null
    }
  }

  /**
   * Execute the query and get the first result or throw an exception
   *
   * @param options FindOneOptions
   *
   * @returns Entity
   */
  async firstOrFail<T>(options: FindOneOptions): Promise<T> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } })

    if (!Array.isArray(items) || items.length === 0) {
      throw new NotFoundException('Resource not found')
    }

    return items[0]
  }

  /**
   * Get the item record with relation matching the attributes
   *
   * @param id number
   * @param options FindOneOptions
   */
  async findOneOrFail<T>(id: number, options?: FindOneOptions): Promise<T> {
    const item = await this.repository.findOne(id, { ...options })

    if (!item) {
      throw new BadRequestException(`Resource not found`)
    }

    return item
  }

  /**
   * Get the items record in array ids
   *
   * @param ids number[]
   */
  async findIdInOrFail<T>(ids: number[]): Promise<T[]> {
    const items = await this.repository.findByIds(ids)

    if (!items) {
      throw new BadRequestException('Resources not found')
    }

    return items
  }

  /**
   * Get list of record matching the attributes condition
   *
   * @param condition FindManyOptions
   * @param columns string[] | null
   *
   * @returns entity
   */
  async findWhere<T>(
    condition: { [key: string]: any },
    columns?: string[],
  ): Promise<T[]> {
    return this.repository.find({
      where: condition,
      select: columns,
    })
  }

  /**
   * Return number of record that match criteria
   *
   * @param options
   *
   * @returns number record by option
   */
  async count(options: FindManyOptions): Promise<number> {
    return await this.repository.count(options)
  }

  /**
   * Return number of record that match criteria
   *
   * @param options
   *
   * @returns number record by option
   */
  async checkExisting(options: FindManyOptions): Promise<void> {
    const count = await this.count(options)

    if (count === 0) {
      throw new NotFoundException(
        this.getMessage({
          message: Messages.errorsOperation.notExist,
          keywords: [this.repository.metadata.tableName],
        }),
      )
    }
  }

  /**
   * Check conflict data get the first result and throw a conflict exception
   *
   * @param options FindOneOptions
   */
  async checkConflict(options: FindOneOptions): Promise<void> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } })

    const properties = Object.keys(options.where)
    const data = properties.length > 0 ? properties.join('or') : 'data'

    if (Array.isArray(items) && items.length !== 0) {
      throw new ConflictException(
        this.getMessage({
          message: Messages.errorsOperation.conflict,
          keywords: [data],
        }),
      )
    }
  }

  /**
   * Create query builder with search field in entity
   *
   * @param params QueryParams
   *
   * @returns SelectQueryBuilder
   */
  async queryBuilder<T>(params: QueryParams): Promise<SelectQueryBuilder<T>> {
    const { entity, fields, keyword } = params
    const orderBy = params.sortBy ?? DEFAULT_SORT_BY
    const orderType = params.sortType ?? DEFAULT_SORT_TYPE

    let baseQuery = this.repository.createQueryBuilder(`${entity}`)

    if (keyword && keyword !== '' && fields) {
      for (const field of fields) {
        baseQuery = baseQuery.where(`${entity}.${field}  LIKE :keyword`, {
          keyword: `%${keyword}%`,
        })
      }
    }

    baseQuery = baseQuery.orderBy(`${entity}.${orderBy}`, orderType)

    if (orderBy !== DEFAULT_SORT_BY) {
      baseQuery = baseQuery.addOrderBy(
        `${entity}.${DEFAULT_SORT_BY}`,
        DEFAULT_SORT_TYPE,
      )
    }

    return baseQuery
  }

  /**
   * Build paginate query with option
   *
   * @param queryBuilder  SelectQueryBuilder
   * @param options IPaginationOptions
   *
   * @returns Pagination
   */
  private async paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const { page, limit } = options

    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount()

    return this.createPaginationObject<T>(items, total, page, limit)
  }

  /**
   * Get the pagination record matching the attributes
   *
   * @param queryBuilder Repository | SelectQueryBuilder | null
   * @param options IPaginationOptions
   */
  async paginationCalculate<T>(
    queryBuilder: Repository<T> | SelectQueryBuilder<T> | null,
    options: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const query =
      queryBuilder instanceof SelectQueryBuilder
        ? queryBuilder
        : this.repository.createQueryBuilder(this.alias)

    options = omit(
      options,
      filter(keys(options), function (key) {
        return isUndefined(options[key])
      }),
    )

    options = { ...defaultPaginationOption, ...options }

    return this.paginateQueryBuilder(query, options)
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
      let result = ''

      const characters = this.getCharFromASCII([
        { from: 97, range: 26 },
        { from: 48, range: 10 },
      ])
      const charactersLength = characters.length

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        )
      }

      return result
    }

    let i = 0
    let slug = slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
    })
    let s = slug

    while (true) {
      i++
      if (i == 100) break

      const count = await this.count({ where: { slug: s } })

      if (count === 0) {
        slug = s
        break
      } else {
        s = `${slug}-${makeId(8)}`
      }
    }

    return slug
  }

  /**
   * Update an entity in repository by option
   *
   * @param option: string | number | Date | ObjectID | FindOneOptions<Entity>,
   * @param data object
   */
  async update(
    option: string | number | Date | ObjectID | FindOneOptions<Entity>,
    data: Entity,
  ): Promise<any> {
    const item = await this.repository.findOne(option)

    const result = await getManager().save(this.entity, { ...item, ...data })

    return result
  }

  /**
   * Create or update a related record matching the attributes, and fill it with values.
   *
   * @param attributes object
   * @param values object
   *
   * @return entity
   */
  async updateOrCreate<T>(
    attributes: { [key: string]: any },
    values: { [key: string]: any },
  ): Promise<T> {
    let item: any

    const items = await this.repository.find({ where: attributes, take: 1 })

    if (!isArray(items) || items.length === 0) {
      item = await this.create(values)
    } else {
      item = await this.update(items[0].id, values)
    }

    return item
  }

  /**
   * Destroy the models for the given criteria
   *
   * @param criteria string | string[] | number | number[]
   */
  async destroy(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindConditions<Entity>,
  ): Promise<void> {
    await this.repository.delete(criteria)
  }
}
