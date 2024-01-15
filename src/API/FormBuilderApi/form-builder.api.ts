import { BaseApi } from "../BaseApi/base.api.ts";
import { AppHttpClient } from "../HttpClient/http-client.ts";
import { GetFormDataPayload } from "./Interfaces/get-form-data-payload.interface.ts";
import { FormDataResponse } from "./Interfaces/get-form-data-base.interface.ts";
import { FormBuilderApiRoutes } from "./form-builder-api-routes.enum.ts";
import { GetAddressByZipCodeResponse } from "./Interfaces/get-address-by-zipcode-response.interface.ts";
import {
  PayloadProgramData,
  Program,
  RawCountryOption,
  RawSeason,
} from "../../Interfaces";

class FormBuilderApi extends BaseApi {
  public async getFormData(
    payload: GetFormDataPayload
  ): Promise<FormDataResponse> {
    try {
      const response = await this.httpClient.get<FormDataResponse>(
        FormBuilderApiRoutes.GetFormData,
        {
          params: {
            product: this.product,
            ...payload,
          },
        }
      );

      return response.data;
    } catch (e) {
      console.error(e);
      //window.location.href = '/login';
    }
  }

  public async getCountryOptions(): Promise<RawCountryOption[]> {
    const response = await this.httpClient.get<RawCountryOption[]>(
      FormBuilderApiRoutes.CountriesList
    );

    return response.data;
  }

  public async getAvailableSeasons(
    countryIsoCode: string
  ): Promise<RawSeason[]> {
    const response = await this.httpClient.get<RawSeason[]>(
      FormBuilderApiRoutes.getAvailableSeasons,
      {
        params: { countryIsoCode },
      }
    );

    return response.data;
  }

  public async getAddressByZipCode(
    zipCode: string,
    country: string
  ): Promise<GetAddressByZipCodeResponse | null> {
    try {
      const zipCodeDataResponse =
        await this.httpClient.post<GetAddressByZipCodeResponse>(
          FormBuilderApiRoutes.GetAddressByZipCode,
          {
            zipCode,
            country,
          }
        );

      return zipCodeDataResponse.data;
    } catch (e) {
      return null;
    }
  }

  public async sendSMS(
    phoneNumber: string,
    countryIsoCode: string
  ): Promise<boolean | null> {
    try {
      const sendSMSResponse = await this.httpClient.post<{ success: boolean }>(
        FormBuilderApiRoutes.SendPassportScanSms,
        {
          phoneNumber,
          countryIsoCode,
        }
      );
      return sendSMSResponse.data.success;
    } catch (e) {
      return null;
    }
  }

  public async getOnwardPrograms(
    payloadProgramData: PayloadProgramData
  ): Promise<Program[]> {
    const response = await this.httpClient.get(
      FormBuilderApiRoutes.getOnwardPrograms,
      {
        params: { ...payloadProgramData },
      }
    );

    return response.data;
  }
}

export default new FormBuilderApi(AppHttpClient.instance);
