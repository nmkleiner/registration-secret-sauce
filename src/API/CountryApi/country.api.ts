import {
  GetCountryResponse,
  GetTranslationsResponse,
} from '@/Modules/Common/API/CountryApi/country-api.interfaces';
import { BaseApi } from '@/Core/Infrastructure/API/base.api';
import { CountryApiRoutes } from '@/Modules/Common/API/CountryApi/country-api-routes.enum';
import { AppHttpClient } from '@/Core/Infrastructure/HttpClient/http-client';

class CountryApi extends BaseApi {
  public async getTranslations(countryIsoCode: string): Promise<GetTranslationsResponse> {
    try {
      const response = await this.httpClient.get<GetTranslationsResponse>(
        CountryApiRoutes.GetTranslations,
        {
          params: {
            product: this.product,
            countryIsoCode,
          },
        },
      );

      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async getCountry(countryIsoCode: string): Promise<GetCountryResponse> {
    try {
      const response = await this.httpClient.get<GetCountryResponse>(CountryApiRoutes.GetCountry, {
        params: {
          product: this.product,
          countryIsoCode,
        },
      });

      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async getControlQuestionActive(): Promise<boolean> {
    try {
      const response = await this.httpClient.get<boolean>(
        CountryApiRoutes.GetControlQuestionActive,
      );
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new CountryApi(AppHttpClient.instance);
