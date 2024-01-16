import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { InputWithOptions } from './index';
import { useDropdownOptionsStore } from '../../Stores/DropdownOptions/dropdown-options.store';
import { BaseSectionInterface } from '../Section/section.interface';
import { CountryOption } from '../Options/country-option';

export class CountryDropdown extends InputWithOptions {
  public declare options: CountryOption[];

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  buildOptions(rawQuestion: RawQuestion): CountryOption[] {
    return useDropdownOptionsStore().dbOptions.countries;
  }
}
