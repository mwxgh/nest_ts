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
