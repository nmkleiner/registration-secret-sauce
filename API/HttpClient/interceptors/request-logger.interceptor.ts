import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { HttpClientRequestInterceptor } from '../http-client.types';

export const requestLoggerInterceptor: HttpClientRequestInterceptor = {
  onFulfilled: (config: AxiosRequestConfig) => {
    const dateTime = dayjs().format('MMMM D YYYY, h:mm:ss a');
    console.info(
      `${dateTime}: A ${config.method} API call to ${config.baseURL}/${config.url} has been sent.`,
    );

    return config;
  },
};
