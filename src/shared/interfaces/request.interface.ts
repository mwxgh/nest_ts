import { SortType } from '@shared/constant/constant'

/**
 * Query params
 */
export interface QueryParams {
  /**
   * Entity of query
   */
  entity: string
  /**
   * Fields to search
   */
  fields?: string[]
  /**
   * Relation entity
   */
  relations?: string[]
  /**
   * Keyword to search
   */
  keyword?: string | ''
  /**
   * Sort list by
   */
  sortBy?: string
  /**
   * Sort type
   */
  sortType?: SortType
  /**
   * Include with relation table
   */
  includes?: string[]
}

/**
 * Query pagination option
 */
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
