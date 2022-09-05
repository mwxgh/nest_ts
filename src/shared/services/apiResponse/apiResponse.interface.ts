export interface LengthAwareMeta {
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface SuccessfullyOperation {
  data: {
    success: boolean;
    message?: string;
  };
}

/** Response for list apis */
export type GetListResponse<T> = {
  data: T[];
};

/** Response for list pagination apis */
export type GetListPaginationResponse<T> = {
  data: T[];
  pagination: LengthAwareMeta;
};
