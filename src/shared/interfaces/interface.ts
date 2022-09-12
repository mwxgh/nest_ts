/**
 * Entity general form
 */
export interface Entity {
  [key: string]: any;
}

/**
 * Response entity form
 */
export type ResponseEntity = Entity;

/**
 * Length aware meta
 */
export interface LengthAwareMeta {
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}
