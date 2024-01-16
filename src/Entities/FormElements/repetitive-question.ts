import {
  LocalRawQuestion,
  RawQuestion,
} from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { InputWithOptions } from './index';
import { useApplicationStore } from '../../Stores/Application/application.store';
import { BasicInput } from './index';
import { isEmpty } from 'lodash-es';
import { RepetitiveButton } from './repetitive-button';
import { OnwardQuestionUniqueNames } from '../../../../excel-registration-front/src/Modules/Onward/Enums/onward-question-names.enum';
import {
  DuplicatedUserAnswer,
  StandardUserAnswer,
} from '../../Types/Form/user-answer.type';
import { isRepetitiveQuestionValue } from '../../Interfaces/Form/Inputs/repetitive-question-value.interface';
import { sanitizeString } from '../../../../excel-registration-front/src/Core/Helpers/sanitize-string';
import { HiddenInput } from './hidden-input';
import { Option } from '../Options/option';

export class RepetitiveQuestion extends InputWithOptions {
  public initialDependents: BasicInput[] = [];
  public displayedDependents: BasicInput[][] = [];
  public cancelledDependents: BasicInput[][] = [];

  public repetitiveButton: RepetitiveButton;
  private excludedDependents: string[] = [OnwardQuestionUniqueNames.requireEpiPen];
  private valuesFromSalesforce: Record<string, string>[] = [];

  constructor(rawQuestion: RawQuestion | LocalRawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.initValuesFromSalesforce(rawQuestion);
  }

  getValue(rawQuestion: RawQuestion): string {
    if (isRepetitiveQuestionValue(rawQuestion.value)) {
      return rawQuestion.value.radioButtonValue;
    }
  }

  initValuesFromSalesforce(rawQuestion: RawQuestion) {
    const getFormIdIndex = (values: Record<string, string>): number => {
      const formId = values['Form_Id__c'];
      return parseInt(formId.split('Id')[1]);
    };

    if (isRepetitiveQuestionValue(rawQuestion.value)) {
      this.valuesFromSalesforce = rawQuestion.value.duplicatedValues.sort(
        (a, b) => getFormIdIndex(a) - getFormIdIndex(b),
      );
    }
  }

  public initializeDependents() {
    const getDependentsIds = (): string[] => {
      return this.options.reduce((acc, option) => {
        const ids = optionCondition[option.id];
        if (isEmpty(ids)) {
          return acc;
        }
        return [...acc, ...ids];
      }, []);
    };
    const getInitialDependents = (dependents: BasicInput[]): BasicInput[] => {
      return dependents
        .filter((formElement) => !(formElement instanceof RepetitiveButton))
        .filter((formElement) => !this.excludedDependents.includes(formElement.uniqueName));
    };
    const initRepetitiveButton = (dependents: BasicInput[]) => {
      this.repetitiveButton = dependents.find(
        (formElement): formElement is RepetitiveButton => formElement instanceof RepetitiveButton,
      );

      if (!this.repetitiveButton) {
        console.error('RepetitiveQuestion: repetitiveButton is not defined');
      }

      this.repetitiveButton.hide();
    };
    const fillDependentInputs = () => {
      if (!isEmpty(this.valuesFromSalesforce)) {
        this.valuesFromSalesforce.forEach((values, index) => {
          if (index >= 1) {
            this.repetitiveButton.incrementIndex();
            this.addDependents(index);
          }

          this.displayedDependents[index].forEach((dependent) => {
            dependent.fillInput(values[dependent.fieldName]);
          });
        });
      }
    };

    const optionCondition = this.getOptionCondition();

    if (!optionCondition) {
      return;
    }

    const dependentsIds: string[] = getDependentsIds();
    const dependents = dependentsIds.map((id) =>
      useApplicationStore().formElementsManager.getFormElementById(id),
    );
    this.initialDependents = getInitialDependents(dependents);

    if (isEmpty(this.initialDependents)) {
      console.error('RepetitiveQuestion: dependents is empty');
    }

    initRepetitiveButton(dependents);

    if (sanitizeString(this.value || '') === 'yes') {
      this.showDependents();
      fillDependentInputs();
    }
  }

  optionSelected(selectedOption: Option): void {
    super.optionSelected(selectedOption);

    if (selectedOption.id === this.options[0].id) {
      this.showDependents();
    } else {
      this.hideDependents();
    }
  }

  public showDependents() {
    if (!isEmpty(this.displayedDependents)) {
      return;
    }
    this.displayedDependents = [this.cloneDependents(this.initialDependents, 0)];
  }

  public addDependents(index: number) {
    this.displayedDependents.push(this.cloneDependents(this.initialDependents, index));
  }

  public hideDependents() {
    if (!this.displayedDependents) {
      return;
    }
    this.cancelledDependents = [...this.displayedDependents];
    this.displayedDependents = [];
  }

  public removeDependents() {
    this.cancelledDependents = [...this.cancelledDependents, this.displayedDependents.pop()];
  }

  public getHiddenDependents(): HiddenInput[] {
    return this.displayedDependents.reduce((acc, dependents) => {
      return [...acc, ...dependents.filter((dependent) => dependent instanceof HiddenInput)];
    }, []);
  }

  private cloneDependents(inputs: BasicInput[], index: number): BasicInput[] {
    return inputs.map((input) => {
      const clone: BasicInput = Object.create(input);
      clone.id += `-${index}`;
      clone.uniqueName += `${index + 1}`;
      clone.isClone = true;

      return clone;
    });
  }

  public get displayDependents() {
    return !isEmpty(this.displayedDependents);
  }

  public getDuplicatedAnswer(): DuplicatedUserAnswer {
    if (this.displayDependents) {
      return {
        duplicatedAnswers: true,
        values: this.getAnswers(this.displayedDependents),
        cancelledValues: this.getAnswers(this.cancelledDependents),
      };
    }
  }

  private getAnswers(inputs: BasicInput[][]): StandardUserAnswer[][] {
    return inputs.map((inputs) =>
      inputs
        .map((input) => input.getAnswer())
        .filter(Boolean)
        .filter((answer): answer is StandardUserAnswer => true),
    );
  }
}
