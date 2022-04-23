export const SortType = {
  DESC: 'DESC',
  ASC: 'ASC',
} as const;

export const SortBy = {
  UPDATED_AT: 'updatedAt',
  CREATED_AT: 'createdAt',
} as const;

export const DEFAULT_SORT_BY = SortBy.UPDATED_AT;

export const DEFAULT_SORT_TYPE = SortType.DESC;
