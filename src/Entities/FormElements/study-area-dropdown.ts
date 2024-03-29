import { Option } from '../Options/option';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { UniversityOption } from '../Options/university-option';
import { BaseSectionInterface } from '../Section/section.interface';
import { InputWithOptions } from './index';
import { OptionTransformer } from '../../Transformers/option.transformer';
import { useDropdownOptionsStore } from '../../Stores/DropdownOptions/dropdown-options.store';

export class StudyAreaDropdown extends InputWithOptions {
  declare options: UniversityOption[];

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  buildOptions(rawQuestion: RawQuestion): Option[] {
    const questionOptions = OptionTransformer.transformQuestionOptions(rawQuestion);

    return [...questionOptions, ...useDropdownOptionsStore().dbOptions.studyAreas];
  }
}
