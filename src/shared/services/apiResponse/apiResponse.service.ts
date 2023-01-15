import { BadRequestException, Injectable } from '@nestjs/common'
import {
  Entity,
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  Pagination,
  SuccessfullyOperation,
} from '../../interfaces/response.interface'
import Messages from '../../message/message'
import { TransformerInterface } from '../../transformers/transformer'

@Injectable()
export class ApiResponseService {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} entity
   * @param {*} transformer
   *
   * @return Entity
   */
  item(entity: Entity, transformer: TransformerInterface): GetItemResponse {
    return transformer.get(entity)
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return array data
   */
  collection(
    collection: Entity[],
    transformer: TransformerInterface,
  ): GetListResponse {
    const resources = collection.map((i) => {
      return transformer.get(i)
    })
    return resources
  }

  /**
   * Response success api
   *
   * @param params.message message specific successful operation
   *
   * @return message specific successful operation pr default message
   */
  success(params?: { message: string }): SuccessfullyOperation {
    const message = params?.message ?? Messages.successfullyOperation.general

    return { success: true, message: message }
  }

  /**
   * Bind a paginator to a transformer and start building a response
   *
   * @param {*} LengthAwarePaginator
   * @param {*} Transformer
   *
   * @return Object
   */
  paginate(
    paginator: Entity,
    transformer: TransformerInterface,
  ): GetListPaginationResponse {
    if (!(paginator instanceof Pagination)) {
      throw new BadRequestException(
        `ApiResponse.paginate expect a Pagination instead a ${typeof paginator}`,
      )
    }

    const items = paginator.items.map((i) => transformer.get(i))

    return {
      data: items,
      pagination: {
        totalItems: paginator.meta.totalItems,
        itemCount: paginator.meta.itemCount,
        itemsPerPage: paginator.meta.itemsPerPage,
        currentPage: paginator.meta.currentPage,
        totalPages: paginator.meta.totalPages,
        nextPage: paginator.meta.nextPage,
        prevPage: paginator.meta.prevPage,
      },
    }
  }
}
