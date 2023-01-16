import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Pagination } from '@shared/interfaces/response.interface'
import { Me } from '@userModule/dto/user.dto'
import { includes, map } from 'lodash'

/**
 * Primitive service
 * Handling basic data types
 */
export class PrimitiveService {
  /**
   * Create pagination object
   *
   * @param items Entities for paginate
   * @param totalItems Count of entities
   * @param currentPage current page
   * @param limit limit record page
   *
   * @return Pagination
   */
  protected createPaginationObject<T>(
    items: T[],
    totalItems: number,
    currentPage: number,
    limit: number,
  ): Pagination<T> {
    const totalPages = Math.ceil(totalItems / limit)
    const nextPage =
      Math.ceil(totalItems / limit) > currentPage ? currentPage + 1 : null
    const prevPage: number = currentPage > 1 ? currentPage - 1 : null

    return new Pagination(items, {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
    })
  }

  /**
   * Check user permission operation with userId
   *
   * @param currentUser User
   * @param userId userId
   */
  checkUserPermissionOperation(params: {
    currentUser: Me
    userId: number
  }): void {
    const { currentUser, userId } = params

    const userRoles = map(currentUser.roles, (r) => r.slug)

    if (includes(userRoles, 'user') && userRoles.length == 1) {
      if (currentUser.id !== userId) {
        throw new ForbiddenException(
          'Permission denied : User role can not operation',
        )
      }
    }
  }

  /**
   * Check includes param and convert to join and select table
   *
   * @param includesParams includes param
   * @param relations relations with table
   *
   * @return join and select table
   */
  convertIncludesParamToJoinAndSelects(params: {
    includesParams: string[]
    relations: string[]
  }): string[] {
    const { includesParams, relations } = params

    const joinAndSelects = includesParams.filter((item) =>
      relations.includes(item),
    )

    if (joinAndSelects.length === 0) {
      throw new BadRequestException('Can not join table with includes params')
    }

    return joinAndSelects
  }

  /**
   * Get message to notice status operation
   *
   * @param message message form
   * @param keywords keyword for each properties
   *
   * @return message
   */
  getMessage(params: { message: string; keywords: string[] }): string {
    let { message } = params

    params.keywords.forEach((keyword) => {
      message = message.replace('${keyword}', keyword)
    })

    return message
  }

  /**
   * Get character from ASCII match criteria
   * ASCII table : https://www.asciitable.com/
   * - ...rest: { from: number; range: number }[] to accept element params instead of array
   * - Eg : getCharFromASCII({ from: 97, range: 26 },
   *                         { from: 48, range: 10 })
   * - params: { from: number; range: number }[] to accept array instead of element params
   * - Eg : getCharFromASCII([{ from: 97, range: 26 },
   *                          { from: 48, range: 10 }])
   */
  protected getCharFromASCII(
    params: { from: number; range: number }[],
  ): string {
    const arrayCharsFromASCII = params.map((o) => {
      const charFromASCII = Array.from(Array(o.range)).map((e, i) => i + o.from)

      return charFromASCII.map((x) => String.fromCharCode(x)).join('')
    })

    return arrayCharsFromASCII.join('')
  }
}
