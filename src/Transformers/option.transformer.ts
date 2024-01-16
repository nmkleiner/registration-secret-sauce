import { isEmpty } from 'lodash-es';
import { Option } from '../Entities/Options/option';
import { StateOption } from '../Entities/Options/state-option';
import { CountryOption } from '../Entities/Options/country-option';
import { RawQuestion } from '../Interfaces/Form/question.interfaces';
import { CheckboxOption } from '../Entities/Options/checkbox-option';
import { QuestionOption } from '../Interfaces/Form/option.interfaces';
import { UniversityOption } from '../Entities/Options/university-option';
import { RawStateOption } from '../Interfaces/raw-state-option.interface';
import { RawUniversityOption } from '../Interfaces/raw-university-option.interface';
import { RawCountryOption } from '../Interfaces/raw-country-option.interface';
import { sortObjectsByProperty } from '../../../excel-registration-front/src/Core/Helpers/sort-objects-by-property';
import { RawDropdownFromDBOption } from '../Interfaces/raw-dropdown-from-db-option.interface';

export class OptionTransformer {
  public static transformQuestionOptions(rawQuestion: RawQuestion): Option[] {
    if (isEmpty(rawQuestion.options)) {
      console.warn('No options found for question', rawQuestion);
      return [];
    }
    return sortObjectsByProperty(
      rawQuestion.options.map((option) => new Option(option)),
      'sort',
    );
  }
  public static transformStateOptions(options: RawStateOption[]): StateOption[] {
    if (isEmpty(options)) {
      console.warn('No options found for states', options);
      return [];
    }
    return options.map((option, index) => new StateOption(option, index));
  }

  public static transformCountryOptions(options: RawCountryOption[]): CountryOption[] {
    if (isEmpty(options)) {
      console.warn('No options found for countries', options);
      return [];
    }
    return options.map((option, index) => new CountryOption(option, index));
  }

  public static transformUniversityOptions(options: RawUniversityOption[]): UniversityOption[] {
    if (isEmpty(options)) {
      console.warn('No options found for university options', options);
      return [];
    }
    return options.map((option, index) => new UniversityOption(option, index));
  }

  public static transformDropdownFromDBOptions(options: RawDropdownFromDBOption[]): Option[] {
    if (isEmpty(options)) {
      console.warn('No options found for dropdown from DB options', options);
      return [];
    }
    return options.map(
      (option, index) =>
        new Option({
          id: option.value,
          resourceId: index,
          sort: index,
          name: option.name,
          mapping: {
            answerName: option.value,
          },
        }),
    );
  }

  public static transformCheckboxOptions(
    options: QuestionOption[],
    name: string,
  ): CheckboxOption[] {
    if (isEmpty(options)) {
      console.warn('No options found for checkbox options', options, name);
      return [];
    }
    return sortObjectsByProperty(
      options.map((option, index) => new CheckboxOption(option)),
      'sort',
    );
  }
}
