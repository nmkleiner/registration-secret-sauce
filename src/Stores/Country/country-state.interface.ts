import { ExcelCountries } from '../../../../excel-registration-front/src/Modules/Excel/Enums/excel-countries.enum';

export interface CountryState {
  name: string;
  areaCode: string;
  resourceId: string;
  dateFormat: string;
  payPalCurrency: string;
  excelIsoCode: ExcelCountries;
  depositAmount: number;
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
