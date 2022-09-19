import {
  ResponseEntity,
  LengthAwareMeta,
} from 'src/shared/interfaces/interface'

/**
 *  Response for success operations
 */
export interface SuccessfullyOperation {
  data: {
    success: boolean
    message?: string
  }
}

/**
 * Response for create and update apis
 */
export type CreateAndUpdateResponse = {
  data: ResponseEntity
}

/**
 * Response for item apis
 */
export type GetItemResponse = {
  data: ResponseEntity
}

/**
 * Response for list apis
 */
export type GetListResponse = {
  data: ResponseEntity[]
}

/**
 * Response for list pagination apis
 */
export type GetListPaginationResponse = {
  data: ResponseEntity[]
  meta: LengthAwareMeta
}
