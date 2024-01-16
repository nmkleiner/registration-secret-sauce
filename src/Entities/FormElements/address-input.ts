import { BasicInput } from './index';
import { Address, isAddress } from '../../Interfaces/Form/Inputs/address.interface';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { PhoneInput } from './phone-input';
import { OnwardQuestionUniqueNames } from '../../../../excel-registration-front/src/Modules/Onward/Enums/onward-question-names.enum';
import { useDropdownOptionsStore } from '../../Stores/DropdownOptions/dropdown-options.store';
import { CountryOption } from '../Options/country-option';
import { useApplicationStore } from '../../Stores/Application/application.store';

export class AddressInput extends BasicInput {
  public addressValue: Address;
  private readonly relatedPhoneInput: PhoneInput;

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);

    this.relatedPhoneInput = this.getRelatedPhoneInput();
    this.setAddress(typeof rawQuestion.value === 'object' ? (rawQuestion.value as Address) : null);
  }

  public setAddress(address?: Address) {
    if (address) {
      this.addressValue = address;
      this.injectPrefixToRelatedPhoneInput(this.getCountryOption(address.country));
    } else {
      this.addressValue = null;
      this.injectPrefixToRelatedPhoneInput(null);
    }
  }

  public getValueForAnswer(): Address {
    return {
      isAddress: true,
      ...this.addressValue,
    };
  }

  public getValue(rawQuestion: RawQuestion): string {
    if (isAddress(rawQuestion.value)) {
      return this.getValueFromAddress(rawQuestion.value);
    }
  }

  public getValueFromAddress(address: Address) {
    const filterAddress = Array.from(
      Object.values(address).filter((value) => typeof value === 'string'),
    );

    return filterAddress.length >= 2 ? filterAddress.join(', ') : '';
  }

  private getCountryOption(countryIsoCode: string): CountryOption {
    const countries = useDropdownOptionsStore().dbOptions.countries;
    return countries.find((country) => country.isoCode === countryIsoCode);
  }

  private injectPrefixToRelatedPhoneInput(option: CountryOption): void {
    if (this.relatedPhoneInput) {
      if (!option) {
        this.relatedPhoneInput.setCountryPrefix('');
        return;
      }

      option.areaCode
        ? this.relatedPhoneInput.setCountryPrefix(`${option.areaCode}`)
        : this.relatedPhoneInput.setCountryPrefix('');
    }
  }

  /*
   * EXPECTED ISSUE: currently the related PhoneInput is constructed b4 this CountryDropdown
   * if this changes there will be no related PhoneInput because FormElementsManager did not call its constructor
   * POSSIBLE SOLUTION: PhoneInput will look for its related CountryDropdown trigger this method
   * */
  private getRelatedPhoneInput(): PhoneInput {
    let phoneUniqueName: OnwardQuestionUniqueNames;
    switch (this.uniqueName) {
      case OnwardQuestionUniqueNames.parent1Address:
        phoneUniqueName = OnwardQuestionUniqueNames.parent2Phone;
        break;
      case OnwardQuestionUniqueNames.parent2Address:
        phoneUniqueName = OnwardQuestionUniqueNames.parent2Phone;
        break;
      case OnwardQuestionUniqueNames.guardianAddress:
        phoneUniqueName = OnwardQuestionUniqueNames.guardianPhone;
        break;
      default:
        return null;
    }
    return useApplicationStore().formElementsManager.getPhoneInputByUniqueName(phoneUniqueName);
  }
}
