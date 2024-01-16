import { Option } from '../Options/option';
import { BasicInput } from './index';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { useApplicationStore } from '../../Stores/Application/application.store';
import { OptionTransformer } from '../../Transformers/option.transformer';
import { useCommonComponentLogic } from '../../../../excel-registration-front/src/Core/Composables/commonComponentLogic/common-component-logic';

export class InputWithOptions extends BasicInput {
  options: Option[];

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.options = this.buildOptions(rawQuestion);
    this.initializeOptionConditions(rawQuestion);
  }

  public handleOptionSelected() {
    useCommonComponentLogic().handleOptionSelected(this.value, this);
  }

  public hide(): this {
    super.hide();
    this.hideDependentFields();
    return this;
  }

  buildOptions(rawQuestion: RawQuestion): Option[] {
    return OptionTransformer.transformQuestionOptions(rawQuestion);
  }

  initializeOptionConditions(rawQuestion: RawQuestion): void {
    if (rawQuestion.optionConditions && rawQuestion.optionConditions.length) {
      rawQuestion.optionConditions.forEach((optionCondition) => {
        const option = this.options.find((option) => option.id === optionCondition.optionId);
        if (option) {
          useApplicationStore().formElementsManager.addOptionCondition(this.id, {
            optionId: optionCondition.optionId,
            triggeredFieldId: optionCondition.triggeredFieldId,
          });
        }
      });
    }
  }

  getOptionCondition(): Record<string, string[]> {
    return useApplicationStore().formElementsManager.getOptionCondition(this.id);
  }

  optionSelected(selectedOption: Option): void {
    this.handleDependentFields(selectedOption.id, true);
  }

  optionDeselected(selectedOption: Option): void {
    this.handleDependentFields(selectedOption.id, false);
  }

  hideDependentFields(): void {
    this.options.forEach((option) => {
      this.handleDependentFields(option.id, false);
    });
  }

  handleDependentFields(selectedOptionId: string, show: boolean): void {
    const optionCondition = this.getOptionCondition();

    if (optionCondition && optionCondition[selectedOptionId]) {
      this.hideOrShowAllOptionTriggeredFields(optionCondition, selectedOptionId, show);
    }
  }

  private hideOrShowAllOptionTriggeredFields(
    optionCondition: Record<string, string[]>,
    optionId: string,
    show: boolean,
  ): void {
    optionCondition[optionId].forEach((triggeredFieldId) => {
      this.hideOrShowFieldById(triggeredFieldId, show);
    });
  }

  private hideOrShowFieldById(fieldId: string, show: boolean): void {
    const field = useApplicationStore().formElementsManager.getFormElementById(fieldId);
    if (field) {
      show ? field.show() : field.hide();
    }
  }
}
