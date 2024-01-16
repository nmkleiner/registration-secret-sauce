import { InputWithOptions } from './index';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { Option } from '../Options/option';
import { OptionTransformer } from '../../Transformers/option.transformer';
import { useUserStore } from '../../Stores/User/user.store';

export class PeerDropdown extends InputWithOptions {
  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  buildOptions(rawQuestion: RawQuestion): Option[] {
    const options = OptionTransformer.transformQuestionOptions(rawQuestion);

    if (!useUserStore().contactInformation?.hasLivingParent) {
      const parentOption = options.find(
        (option) => option.value === 'Peer from my parents country',
      );
      parentOption.hide();
    }

    return options;
  }
}
