import { Injectable, BadRequestException } from '@nestjs/common';
import { Pagination } from '../pagination';
import { TransformerInterface } from '../../transformers/transformer';

interface Entity {
  [key: string]: any;
}

interface LengthAwareMeta {
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

@Injectable()
export class ApiResponseService {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} Object
   * @param {*} Transformer
   *
   * @return Object
   */
  item(
    entity: Entity,
    transformer: TransformerInterface,
  ): { data: { [key: string]: any } } {
    return { data: transformer.get(entity) };
  }

  /**
   * Bind an item to a object response
   *
   * @param {*} data
   *
   * @return Object data
   */
  object(data: any) {
    return { data };
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return Object
   */
  collection(
    collection: Entity[],
    transformer: TransformerInterface,
  ): { data: { [key: string]: any } } {
    const data = collection.map((i) => {
      return transformer.get(i);
    });
    return { data: data };
  }

  /**
   * Create a new primitive resource object
   *
   * @param collection
   * @param transformer
   *
   * @return object
   */
  primitive(data: { [key: string]: any }): { data: { [key: string]: any } } {
    return { data };
  }

  /**
   * Response success api
   *
   * @param data
   *
   * @return message
   */
  success(): { data: { success: boolean } } {
    return { data: { success: true } };
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
    paginator: { [key: string]: any },
    transformer: TransformerInterface,
  ): { data: { [key: string]: any }; meta: LengthAwareMeta } {
    if (!(paginator instanceof Pagination)) {
      throw new BadRequestException(
        `ApiResponse.paginate expect a Pagination instead a ${typeof paginator}`,
      );
    }
    const items = paginator.items.map((i) => {
      return transformer.get(i);
    });
    return {
      data: items,
      meta: {
        pagination: {
          total: paginator.meta.totalItems,
          perPage: paginator.meta.itemsPerPage,
          currentPage: paginator.meta.currentPage,
          totalPages: paginator.meta.totalPages,
        },
      },
    };
  }
}
