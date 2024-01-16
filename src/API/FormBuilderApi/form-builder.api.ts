import { BaseApi } from '../../../../excel-registration-front/src/Core/Infrastructure/API/base.api';
import { AppHttpClient } from '../../../../excel-registration-front/src/Core/Infrastructure/HttpClient/http-client';
import { RawCountryOption } from '../../Interfaces/raw-country-option.interface';
import { FormBuilderApiRoutes } from './form-builder-api-routes.enum';
import { GetFormDataPayload } from './Interfaces/get-form-data-payload.interface';
import { GetAddressByZipCodeResponse } from './Interfaces/get-address-by-zipcode-response.interface';
import { RawSeason } from '../../Interfaces/raw-season.interface';
import { FormDataResponse } from './Interfaces/get-form-data-base.interface';
import { PayloadProgramData, Program } from '../../../../excel-registration-front/src/Modules/Onward/Interfaces/program.interface';

class FormBuilderApi extends BaseApi {
  public async getFormData(payload: GetFormDataPayload): Promise<FormDataResponse> {
    try {
      const response = await this.httpClient.get<FormDataResponse>(
        FormBuilderApiRoutes.GetFormData,
        {
          params: {
            product: this.product,
            ...payload,
          },
        },
      );

      return response.data;
    } catch (e) {
      console.error(e);
      //window.location.href = '/login';
    }
  }

  public async getCountryOptions(): Promise<RawCountryOption[]> {
    const response = await this.httpClient.get<RawCountryOption[]>(
      FormBuilderApiRoutes.CountriesList,
    );

    return response.data;
  }

  public async getAvailableSeasons(countryIsoCode: string): Promise<RawSeason[]> {
    const response = await this.httpClient.get<RawSeason[]>(
      FormBuilderApiRoutes.getAvailableSeasons,
      {
        params: { countryIsoCode },
      },
    );

    return response.data;
  }

  public async getAddressByZipCode(
    zipCode: string,
    country: string,
  ): Promise<GetAddressByZipCodeResponse | null> {
    try {
      const zipCodeDataResponse = await this.httpClient.post<GetAddressByZipCodeResponse>(
        FormBuilderApiRoutes.GetAddressByZipCode,
        {
          zipCode,
          country,
        },
      );

      return zipCodeDataResponse.data;
    } catch (e) {
      return null;
    }
  }

  public async sendSMS(phoneNumber: string, countryIsoCode: string): Promise<boolean | null> {
    try {
      const sendSMSResponse = await this.httpClient.post<{ success: boolean }>(
        FormBuilderApiRoutes.SendPassportScanSms,
        {
          phoneNumber,
          countryIsoCode,
        },
      );
      return sendSMSResponse.data.success;
    } catch (e) {
      return null;
    }
  }

  public async getOnwardPrograms(payloadProgramData: PayloadProgramData): Promise<Program[]> {
    const response = await this.httpClient.get(FormBuilderApiRoutes.getOnwardPrograms, {
      params: { ...payloadProgramData },
    });

    return response.data;
  }
}

export default new FormBuilderApi(AppHttpClient.instance);
