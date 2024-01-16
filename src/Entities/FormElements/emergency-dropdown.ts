import { InputWithOptions } from './index';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { Option } from '../Options/option';
import { OptionTransformer } from '../../Transformers/option.transformer';
import { useApplicationStore } from '../../Stores/Application/application.store';

export class EmergencyDropdown extends InputWithOptions {
  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  buildOptions(rawQuestion: RawQuestion): Option[] {
    const options = OptionTransformer.transformQuestionOptions(rawQuestion);
    useApplicationStore().parentSectionManager.initialOptions(options);
    return options;
  }
}
