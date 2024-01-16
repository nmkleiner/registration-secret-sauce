import { InputWithMultiSelect } from './index';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import { OptionTransformer } from '../../Transformers/option.transformer';
import { useDropdownOptionsStore } from '../../Stores/DropdownOptions/dropdown-options.store';
import { CheckboxOption } from '../Options/checkbox-option';
import { UserInput } from '../../Types/Form/user-input.type';
import {
  CancelMedical,
  DuplicateCondition,
  MedicalConditionAnswer,
  MedicalDiagnosisUserAnswer,
  RawMedicalCondition,
} from '../../Types/Form/user-answer.type';
import { isEmpty } from 'lodash-es';

export class MedicalDiagnosis extends InputWithMultiSelect {
  private readonly values: RawMedicalCondition[];
  public canceledOptionsValues: Map<string, string> = new Map();

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.id = rawQuestion.id;
    this.values = rawQuestion.value as RawMedicalCondition[];
  }

  public initializeSelectedOptions(): void {
    if (!isEmpty(this.values)) {
      this.values.forEach((medicalCondition: RawMedicalCondition) => {
        const value = this.getMedicalConditionName(medicalCondition);
        this.selectedOptionValues.add(value);

        const option = this.options.find((option) => option.value === value);
        if (option) {
          this.optionSelected(option);
        }
      });
    }
  }

  buildOptions(rawQuestion: RawQuestion): CheckboxOption[] {
    const questionOptions = OptionTransformer.transformCheckboxOptions(
      rawQuestion.options,
      rawQuestion.name,
    );
    return [...questionOptions, ...useDropdownOptionsStore().dbOptions.medicalDiagnoses];
  }

  getValueForAnswer(): UserInput {
    return super.getValueForAnswer();
  }

  private getMedicalConditionName(medicalCondition: RawMedicalCondition): string {
    // In the rare case that Form_Id__c is null, we'll use Medical_Condition_Type__c to avoid splitting null
    // Attention - in some cases Medical_Condition_Type__c is not exactly the same string that we expect
    // (For example "Anxiety Or Depression" vs. "Anxiety or depression")
    let medicalConditionName;

    if (medicalCondition.Form_Id__c) {
      const medicalConditionSplit = medicalCondition.Form_Id__c.split('-');
      if (medicalConditionSplit.length > 2) {
        medicalConditionSplit.shift();
        medicalConditionName = medicalConditionSplit.join('-');
      } else {
        medicalConditionName = medicalConditionSplit[1];
      }
    } else {
      medicalConditionName = medicalCondition.Medical_Condition_Type__c;
    }

    return medicalConditionName;
  }

  public updateCanceledOptions(optionValue: string): void {
    if (!isEmpty(this.values)) {
      const rawMedicalConditionFromSF: RawMedicalCondition =
        this.getMedicalConditionItem(optionValue);

      if (rawMedicalConditionFromSF) {
        if (!this.isSelected(optionValue)) {
          this.canceledOptionsValues.set(rawMedicalConditionFromSF.Id, optionValue);
        } else {
          this.canceledOptionsValues.delete(rawMedicalConditionFromSF.Id);
        }
      }
    }
  }

  getMedicalConditionItem(value: string): RawMedicalCondition {
    return this.values.find(
      (medicalCondition: RawMedicalCondition) =>
        this.getMedicalConditionName(medicalCondition).toLowerCase() === value.toLowerCase(),
    );
  }

  getCancelledMedicalCondition(): CancelMedical[] {
    const cancelledMedicalConditions: CancelMedical[] = [];
    for (let [key, value] of this.canceledOptionsValues) {
      cancelledMedicalConditions.push({
        Id: key,
        name: value,
      });
    }
    return cancelledMedicalConditions;
  }

  getMedicalConditions(): MedicalConditionAnswer[] {
    const medicalDiagnosisValues: string[] = this.getValueForAnswer().toString().split(';');
    return medicalDiagnosisValues.map((condition: string) => {
      const duplicateValues: DuplicateCondition[][] = [[]];
      const medicalCondition: RawMedicalCondition = this.getMedicalConditionItem(condition);

      if (medicalCondition) {
        duplicateValues[0].push({ key: this.id, value: medicalCondition.Id });
      }

      return {
        condition,
        values: { cancelledValues: [], duplicatedValues: duplicateValues },
      };
    });
  }

  getAnswer(): MedicalDiagnosisUserAnswer {
    return {
      MedicalDiagnosis: true,
      CancelledMedicalConditions: this.getCancelledMedicalCondition(),
      MedicalConditions: this.getMedicalConditions(),
    };
  }
}
