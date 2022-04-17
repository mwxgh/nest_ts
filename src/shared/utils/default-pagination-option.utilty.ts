import { FindManyQueryParams } from '../validators/find-many-query-params.validator';
import { IPaginationOptions } from '../services/pagination';

export const defaultPaginationOption = (
  option: FindManyQueryParams,
): IPaginationOptions => ({
  limit: option.perPage ? option.perPage : 10,
  page: option.page ? Number(option.page) : 1,
});
