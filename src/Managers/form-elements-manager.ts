import { BasicInput, InputWithOptions } from "../Entities/FormElements";
import { QuestionTypes } from "registration-secret-sauce";
import { InputWithMultiSelect } from "../Entities/FormElements";
import { QuestionUniqueNames } from "registration-secret-sauce";
import { OnwardQuestionUniqueNames } from "@/Modules/Onward/Enums/onward-question-names.enum";
import { PhoneInput } from "../Entities/FormElements/phone-input";

export interface OptionCondition {
  optionId: string;
  triggeredFieldId: string;
}

export default class FormElementsManager {
  //  first string is the field id, second string is the option id, third string is the triggered field ids
  private optionConditionsRegistry: Record<string, Record<string, string[]>> =
    {};
  private formElementsRegistry: Record<string, BasicInput> = {};

  public addOptionCondition(fieldId: string, optionCondition: OptionCondition) {
    if (!this.optionConditionsRegistry[fieldId]) {
      this.optionConditionsRegistry[fieldId] = {};
    }
    if (!this.optionConditionsRegistry[fieldId][optionCondition.optionId]) {
      this.optionConditionsRegistry[fieldId][optionCondition.optionId] = [];
    }
    this.optionConditionsRegistry[fieldId][optionCondition.optionId].push(
      optionCondition.triggeredFieldId
    );
  }

  public getOptionCondition(fieldId: string): Record<string, string[]> {
    if (!this.optionConditionsRegistry[fieldId]) {
      return null;
    }
    return this.optionConditionsRegistry[fieldId];
  }

  public initializeOptionConditions(): void {
    //   hide all the triggered fields
    Object.keys(this.optionConditionsRegistry).forEach((fieldId) => {
      Object.keys(this.optionConditionsRegistry[fieldId]).forEach(
        (optionId) => {
          this.optionConditionsRegistry[fieldId][optionId].forEach(
            (triggeredFieldId) => {
              const triggeredField = this.getFormElementById(triggeredFieldId);
              if (triggeredField) {
                triggeredField.hide();
              }
            }
          );
        }
      );
    });

    this.getFormElementsList().forEach((formElement) => {
      if (formElement instanceof InputWithOptions) {
        formElement.handleOptionSelected();
      }
    });
  }

  public addFormElement(field: BasicInput) {
    this.formElementsRegistry[field.id] = field;
  }

  public getFormElementById(fieldId: string): BasicInput {
    return this.formElementsRegistry[fieldId];
  }

  public getFormElementByType(type: QuestionTypes.waiver): InputWithMultiSelect;
  public getFormElementByType(type: QuestionTypes): BasicInput {
    return this.getFormElementsList().find(
      (formElement) => formElement.questionType === type
    );
  }

  public getFormElementByUniqueName(
    uniqueName: QuestionUniqueNames | OnwardQuestionUniqueNames
  ): BasicInput {
    return this.getFormElementsList().find(
      (formElement) => formElement.uniqueName === uniqueName
    );
  }

  public getPhoneInputByUniqueName(
    uniqueName: QuestionUniqueNames | OnwardQuestionUniqueNames
  ): PhoneInput {
    const input = this.getFormElementByUniqueName(uniqueName);
    if (input instanceof PhoneInput) {
      return input;
    }
    return null;
  }

  private getFormElementsList(): BasicInput[] {
    return Object.values(this.formElementsRegistry);
  }
}
