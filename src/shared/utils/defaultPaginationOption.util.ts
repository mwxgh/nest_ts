import { QueryPaginateDto } from '../dto/queryParams.dto'
import { IPaginationOptions } from '../interfaces/request.interface'

export const defaultPaginationOption = (
  option: QueryPaginateDto,
): IPaginationOptions => ({
  limit: option.perPage ? Number(option.perPage) : 10,
  page: option.page ? Number(option.page) : 1,
})
