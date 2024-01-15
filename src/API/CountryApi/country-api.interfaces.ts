export type GetCountryResponse = CountryDto;

export interface GetTranslationsResponse {
  translations: ApplicationDictionary;
  privacyPolicyTranslation: string;
  returningApplicantTranslation: returningApplicantTranslationInterface;
}

export class returningApplicantTranslationInterface {
  header: string;
  firstQuestionBeforeMonth: string;
  firstQuestionAfterMonth: string;
  secondQuestionBeforeMonth: string;
  secondQuestionAfterMonth: string;
  yesOption: string;
  noOption: string;
  notSureOption: string;
  beforeWaiverLink: string;
  waiverLink: string;
  footerYes: string;
  footerNo: string;
  continue: string;
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
