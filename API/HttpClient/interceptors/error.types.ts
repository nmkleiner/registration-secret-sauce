export interface ApiError {
  field: string;
  message: string;
}

export interface ApiErrorResponseData {
  error: {
    code: string;
    message: string;
    reason: string;
    errors?: ApiError[];
  };
}
