import { returningApplicantTranslationInterface } from '../../Stores/Country/country-state.interface';

export type GetCountryResponse = CountryDto;

export interface GetTranslationsResponse {
  translations: ApplicationDictionary;
  privacyPolicyTranslation: string;
  returningApplicantTranslation: returningApplicantTranslationInterface;
}

export interface CountryDto {
  name: string;
  isoCode: string;
  areaCode: string;
  resourceId: string;
  dateFormat: string;
  depositAmount: number;
  payPalCurrency: string;
}

export interface ApplicationDictionary {
  [key: string]: Record<string, string>;
}
