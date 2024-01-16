import {
  LocalRawQuestion,
  RawQuestion,
} from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { BasicInput } from './index';

export class RepetitiveButton extends BasicInput {
  public index: number = 0;
  public minimumIndex: number = 0;
  public maximumIndex: number = 5 - 1; // TODO: receive from back

  constructor(rawQuestion: RawQuestion | LocalRawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  public incrementIndex() {
    if (this.index === this.maximumIndex) {
      return;
    }
    this.index++;
  }

  public decrementIndex() {
    if (this.index === this.minimumIndex) {
      return;
    }

    this.index--;
  }
}
