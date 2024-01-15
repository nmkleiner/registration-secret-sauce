import { AxiosResponse } from 'axios';
import { HttpClientResponseInterceptor } from '../http-client.types';

export const responseTransformerInterceptor: HttpClientResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    console.log(response.config.url, response.data.data);
    return response.data;
  },
};
