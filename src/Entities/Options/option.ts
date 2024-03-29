import { AnswerMapping, QuestionOption } from '../../Interfaces/Form/option.interfaces';
import { sanitizeStringButKeepCase } from '../../../../excel-registration-front/src/Core/Helpers/sanitize-string';
import { OptionInterface } from '../../Interfaces/Form/Inputs/option.interface';
import { IsVisible } from '../BaseClasses/is-visible';

export class Option extends IsVisible implements OptionInterface {
  public id: string;
  public sort: number;
  public value: string;
  public mapping?: AnswerMapping;

  constructor(rawOption: QuestionOption) {
    super();
    this.id = rawOption.id;
    this.label = sanitizeStringButKeepCase(rawOption.name);
    this.sort = rawOption.sort;
    this.value = sanitizeStringButKeepCase(
      rawOption.mapping ? rawOption.mapping.answerName : rawOption.name,
    );
    this.mapping = rawOption.mapping;
  }
}
