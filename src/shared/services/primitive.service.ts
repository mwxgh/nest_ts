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
   * Check role operation
   *
   * @param currentUser User
   * @param userId userId
   */
  checkRoleOperation({
    currentUser,
    userId,
  }: {
    currentUser: Me
    userId: number
  }): void {
    const userRoles = map(currentUser.roles, (r) => r.slug)

    if (!includes(userRoles, 'admin') && currentUser.id !== userId) {
      throw new ForbiddenException('This role can not operation')
    }
  }

  /**
   * Check user operation with userId
   *
   * @param currentUser User
   * @param userId userId
   */
  checkUserOperation({
    currentUser,
    userId,
  }: {
    currentUser: Me
    userId: number
  }): void {
    if (userId !== currentUser.id) {
      throw new ForbiddenException('This user can not operation')
    }
  }

  /**
   * Check role user only
   *
   * @param currentUser User
   */
  checkRoleUserOnly(currentUser: Me): boolean {
    const userRoles = map(currentUser.roles, (r) => r.slug)

    if (userRoles.every((item) => ['user'].includes(item))) {
      return true
    }

    return false
  }
  /**
   * Check includes param and convert to join and select table
   *
   * @param includesParams includes param
   * @param relations relations with table
   *
   * @return join and select table
   */
  checkIncludeParam({
    includesParams,
    relations,
  }: {
    includesParams: string[]
    relations: string[]
  }): void {
    if (includesParams.some((item) => !relations.includes(item))) {
      throw new BadRequestException('Can not join table with includes params')
    }
  }

  /**
   * Get message to notice status operation
   *
   * @param message message form
   * @param keywords keyword for each properties
   *
   * @return message
   */
  getMessage(params: { message: string; keywords?: string[] }): string {
    let { message } = params

    if (params.keywords && params.keywords.length > 0) {
      params.keywords.forEach((keyword) => {
        message = message.replace('${keyword}', keyword)
      })
    }

    return message
  }

  /**
   * Sanitize data
   * @param data string
   */
  sanitize(data: string): string {
    return data.toLowerCase().trim()
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
