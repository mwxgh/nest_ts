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
