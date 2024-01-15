import { useModalsStore } from '../../../excel-registration-front/src/Modules/Common/Stores/Modals/modals.store';
import AppConfig from '../../../excel-registration-front/src/Core/Infrastructure/Config/AppConfig';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpStatusEnum } from './Enums/http-status.enum';
import {
  extractErrorId,
  extractResponseCode,
} from './Helpers/ExceptionsHelper';
import { ModalNames } from '../../../excel-registration-front/src/Modules/Common/Stores/Modals/modals-state.interface';
import { HttpClientInterface } from './http-client.interface';
import { UNAVAILABLE_SEASON } from './Constants/http-error';

class HttpClient implements HttpClientInterface {
  /**
   * The axios instance.
   */
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create(this.getConfig());
    this.setRequestInterceptor();
    this.setResponseInterceptor();
  }

  /**
   * Axios basic configuration
   * Some general configuration can be added like timeout, headers, params etc.
   * More details can be found on https://github.com/axios/axios
   * */
  public getConfig(): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      baseURL: AppConfig.baseApiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: null,
      },
    };

    if (AppConfig.jwt) {
      config.headers.Authorization = AppConfig.jwt;
    }

    return config;
  }

  public setRequestInterceptor() {
    this.instance.interceptors.request.use((config) => {
      config.headers.Authorization = AppConfig.jwt;
      console.log(config?.url, JSON.stringify(config?.params));
      return config;
    });
  }

  public setResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response) => {
        const { baseURL, url } = response?.config;
        console.log(`${baseURL}/${url}`, response?.data?.data);
        return response;
      },
      async (error: AxiosError) => {
        const errorCode = extractResponseCode(error);
        const errorId = extractErrorId(error);

        switch (errorCode) {
          case HttpStatusEnum.INTERNAL_SERVER_ERROR:
            await useModalsStore().openModal(ModalNames.error);
            return;
          case HttpStatusEnum.NOT_ACCEPTABLE:
            await useModalsStore().openModal(ModalNames.error);
        }

        switch (errorId) {
          case UNAVAILABLE_SEASON:
            await useModalsStore().openModal(ModalNames.unavailableSeason);
            return;
        }
      },
    );
  }
}

const AppHttpClient = new HttpClient();

export { HttpClient, AppHttpClient };
