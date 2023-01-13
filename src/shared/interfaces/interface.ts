import { SortType } from '../constant/constant'

/**
 * Entity general form
 */
export interface Entity {
  [key: string]: any
}

/**
 * Response entity form
 */
export type ResponseEntity = Entity

/**
 * Length aware meta
 */
export interface LengthAwareMeta {
  total: number
  perPage: number
  currentPage: number
  totalPages: number
  nextPage: number | null
  prevPage: number | null
}

/**
 * Query params
 */
export interface QueryParams {
  /** Entity */
  entity: string
  /** search by some fields */
  fields?: string[]
  /** search by keyword */
  keyword?: string | ''
  /** sort list by */
  sortBy?: string
  /** sort type */
  sortType?: SortType
  /** include with relation table */
  includes?: string[]
}
export interface IPaginationOptions {
  /**
   * the amount of items to be requested per page
   */
  limit?: number
  /**
   * the page that is requested
   */
  page?: number
  /**
   * a basic route for generating links (i.e., WITHOUT query params)
   */
  route?: string
}

export interface IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  itemCount: number
  /**
   * the total amount of items
   */
  totalItems: number
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number
  /**
   * the current page this paginator "points" to
   */
  currentPage: number
  /**
   * the next page this paginator "points" to
   */
  nextPage: number | null
  /**
   * the previous page this paginator "points" to
   */
  prevPage: number | null
}

export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta,
  ) {}
}
