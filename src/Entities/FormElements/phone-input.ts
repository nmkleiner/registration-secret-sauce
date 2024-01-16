import { BasicInput } from './index';
import {
  LocalRawQuestion,
  RawQuestion,
} from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { stringToDecimalInt } from '../../../../excel-registration-front/src/Core/Helpers/string-to-decimal-in';
import { useCountryStore } from '../../Stores/Country/country.store';

export class PhoneInput extends BasicInput {
  public countryName: string;
  public countryPrefix = '';
  public displayPhonePrefix?: boolean;
  private readonly phoneFormat = 'XXX-XXX-XXXXXX';

  constructor(rawQuestion: RawQuestion | LocalRawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.rules.minCharacters = [String(this.phoneFormat.length - 3)]; //Supporting also XXX-XXX (with prefix)
    this.rules.maxCharacters = [String(this.phoneFormat.length)];
    this.displayPhonePrefix = rawQuestion.displayPhonePrefix || false;
    this.evaluatePrefix();
  }

  public getValueForAnswer(): string {
    if (!this.value) {
      return '';
    }
    if (!this.countryPrefix || this.displayPhonePrefix) {
      return this.value;
    }
    return `${this.countryPrefix}-${this.value}`;
  }

  public updateCountryName(countryName: string): void {
    this.countryName = countryName;
  }

  public setCountryPrefix(countryPrefix: string) {
    this.countryPrefix = countryPrefix ? String(stringToDecimalInt(countryPrefix)) : '';
  }

  /*
   * If no prefix - set prefix from store
   * */
  private evaluatePrefix() {
    if (!this.countryPrefix) {
      const { areaCode } = useCountryStore();
      this.setCountryPrefix(areaCode);
    }
  }
}
