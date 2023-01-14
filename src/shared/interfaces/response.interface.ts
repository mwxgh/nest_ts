/**
 * Entity general
 */
export interface Entity {
  /**
   * Any properties of entity
   */
  [key: string]: any
}

/**
 * Response entity
 */
export type ResponseEntity = Entity

/**
 * Length aware meta in list pagination
 */
export interface LengthAwareMeta {
  /**
   * the total amount of items
   */
  total: number
  /**
   * the per page amount of items
   */
  perPage: number
  /**
   * the current page this paginator "points" to
   */
  currentPage: number
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number
  /**
   * the next page this paginator "points" to
   */
  nextPage: number | null
  /**
   * the previous page this paginator "points" to
   */
  prevPage: number | null
}

/**
 * Pagination meta
 */
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

/**
 * Response with pagination
 */
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
