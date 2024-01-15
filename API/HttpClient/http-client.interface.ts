import { AxiosInstance } from 'axios';
import {
  HttpClientRequestInterceptor,
  HttpClientResponseInterceptor,
} from './http-client.types';

export type HttpClientInstanceInterface = AxiosInstance;

export interface HttpClientInterface {
  instance: AxiosInstance;
  setRequestInterceptor: (interceptor: HttpClientRequestInterceptor) => void;
  setResponseInterceptor: (interceptor: HttpClientResponseInterceptor) => void;
}
