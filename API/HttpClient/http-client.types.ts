import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ServerResponse<T> {
  data: T;
}

export type ApiResponse<T> = ServerResponse<T>;

export type HttpClientRequestInterceptor = {
  onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  /**
   * Developer, pay attention!
   * Using any type is the last resort.
   * If needed, use eslint-disable comments with caution.
   */
  onRejected?: (error: unknown) => unknown;
};

export type HttpClientResponseInterceptor = {
  onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /**
   * Developer, pay attention!
   * Using unknown type is the last resort.
   * If needed, use eslint-disable comments with caution.
   */
  onRejected?: (error: unknown) => unknown;
};

export enum HttpStatusCodes {
  OK = 200,
  Created = 201,
  InternalServerError = 500,
  ServerError = 600,
  Unauthorized = 601,
  Forbidden = 603,
  NotFound = 604,
}
