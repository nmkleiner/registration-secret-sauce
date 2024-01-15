import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { HttpStatusEnum } from "./Enums/http-status.enum";
import {
  extractErrorId,
  extractResponseCode,
} from "./Helpers/ExceptionsHelper";
import { HttpClientInterface } from "./http-client.interface";
import { UNAVAILABLE_SEASON } from "./Constants/http-error";
import { useConfig } from "../../Config/use-config.ts";
import { ModalNames } from "../../Stores/Modals/modals-state.interface.ts";
import { useModalsStore } from "../../Stores/Modals/modals.store.ts";

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
      baseURL: useConfig().getConfig("VITE_BASE_API_URL"),
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: null,
      },
    };

    const jwt = useConfig().getConfig("jwt");
    if (jwt) {
      config.headers.Authorization = jwt;
    }

    return config;
  }

  public setRequestInterceptor() {
    this.instance.interceptors.request.use((config) => {
      config.headers.Authorization = useConfig().getConfig("jwt");
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
      }
    );
  }
}

const AppHttpClient = new HttpClient();

export { HttpClient, AppHttpClient };
