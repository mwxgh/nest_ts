import {
  LengthAwareMeta,
  ResponseEntity,
} from 'src/shared/interfaces/interface'

/**
 *  Response for success operations
 */
export interface SuccessfullyOperation {
  success: boolean
  message?: string
}

/**
 * Response for create apis
 */
export type CreateResponse = ResponseEntity

/**
 * Response for update apis
 */
export type UpdateResponse = ResponseEntity

/**
 * Response for item apis
 */
export type GetItemResponse = {
  data: ResponseEntity
}

/**
 * Response for item apis not object
 */
export type GetItemResponseNotObject = ResponseEntity

/**
 * Response for list apis
 */
export type GetListResponse = {
  data: ResponseEntity[]
}

export type GetListResponseWithoutDataObj = ResponseEntity[]

/**
 * Response for list pagination apis
 */
export type GetListPaginationResponse = {
  data: ResponseEntity[]
  pagination: LengthAwareMeta
}
