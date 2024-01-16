// import { ExcelCountries } from '@/Modules/Excel/Enums/excel-countries.enum';
import { returningApplicantTranslationInterface } from "../../API";

export interface CountryState {
  name: string;
  areaCode: string;
  resourceId: string;
  dateFormat: string;
  payPalCurrency: string;
  // excelIsoCode: ExcelCountries;
  depositAmount: number;
  privacyPolicyTranslation: string;
  returningApplicantTranslation: returningApplicantTranslationInterface;
}
