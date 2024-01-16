import { Option } from './option';
import { QuestionOption } from '../../Interfaces/Form/option.interfaces';

export class CheckboxOption extends Option {
  constructor(rawOption: QuestionOption) {
    super(rawOption);
  }
}
