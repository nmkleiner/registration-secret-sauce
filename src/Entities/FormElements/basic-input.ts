import {
  getLanguageRules,
  getRulesByQuestionFormat,
  getRulesByQuestionRules,
  getRulesByQuestionUniqueName,
} from '../../../../excel-registration-front/src/Core/Validation/assign-validation-rules';
import { QuestionFormat } from '../../Enums/question-format.enum';
import { Rules, ValidationRules } from '../../../../excel-registration-front/src/Core/Validation/rules';
import { UserInput } from '../../Types/Form/user-input.type';
import { ComponentTypes, QuestionTypes } from '../../Enums/input-types.enum';
import { UserAnswer } from '../../Types/Form/user-answer.type';
import { BaseSectionInterface } from '../Section/section.interface';
import {
  LocalRawQuestion,
  RawQuestion,
} from '../../Interfaces/Form/question.interfaces';
import { useProduct } from '../../../../excel-registration-front/src/Core/Composables/program/useProduct';
import { OnwardQuestionUniqueNames } from '../../../../excel-registration-front/src/Modules/Onward/Enums/onward-question-names.enum';
import { IsVisible } from '../BaseClasses/is-visible';

export class BasicInput extends IsVisible {
  id: string;
  value: string;
  componentType: ComponentTypes;
  questionTypeName: string;
  questionFormatName: string;
  uniqueName: string;
  fieldName: string;
  objectName: 'israel_passport' | string;
  columns: number;
  sectionColumns: number;
  sectionName: string;
  sort: number;
  hint: string;
  questionType: QuestionTypes;
  questionFormat: QuestionFormat;
  mask: string;
  rules: Rules;
  isVisible: boolean = true;
  isClone: boolean = false;
  readonly?: boolean;

  setErrors: (message: string | string[]) => void;

  constructor(rawQuestion: RawQuestion | LocalRawQuestion, formSection: BaseSectionInterface) {
    super();
    this.id = rawQuestion.id;
    this.hint = rawQuestion.hint;
    this.sort = rawQuestion.sort;
    this.label = rawQuestion.name?.trim();

    this.questionFormat = rawQuestion.format ? rawQuestion.format.id : null;
    this.questionFormatName = rawQuestion.format ? rawQuestion.format.name : 'no format';

    this.questionType = rawQuestion.type ? rawQuestion.type.id : null;
    this.questionTypeName = rawQuestion.type ? rawQuestion.type.name : 'no type';

    this.sectionColumns = formSection.columns || 1;
    this.sectionName = formSection.name || 'no section name';
    this.columns = rawQuestion.displayColumnNumber || this.sectionColumns;
    this.value = this.getValue(rawQuestion);
    this.uniqueName = this.getUniqueName(rawQuestion);
    this.fieldName = this.getFieldName(rawQuestion);
    this.objectName = this.getObjectName(rawQuestion);
    this.readonly = this.getReadonly(rawQuestion);
    this.mask = this.getMask();
    this.rules = this.getRules(rawQuestion);
    this.componentType = this.getComponentType(rawQuestion);
  }

  public getValueForAnswer(): UserInput {
    return this.value;
  }

  public getAnswer(): UserAnswer {
    const value = this.getValueForAnswer();
    const noMapping = this.fieldName === 'no mapping';
    if (noMapping) {
      console.warn('No mapping for question', this.label);
      return null;
    }
    if (!value) {
      return null;
    }
    return {
      key: this.getKey(),
      value,
    };
  }

  public lock() {
    this.readonly = true;
  }

  public unlock() {
    this.readonly = false;
  }

  public getValue(rawQuestion: RawQuestion): string {
    if (typeof rawQuestion.value === 'string' || typeof rawQuestion.value === 'boolean') {
      return rawQuestion.value;
    }
    return null;
  }

  public setSetErrors(setErrors: (message: string | string[]) => void) {
    this.setErrors = setErrors;
  }

  public addValidationRule(rule: ValidationRules, param: string | string[]) {
    this.rules[rule] = param;
  }

  private getReadonly(rawQuestion: RawQuestion | LocalRawQuestion): boolean {
    if ('readonly' in rawQuestion) {
      return rawQuestion.readonly;
    }

    return false;
  }

  private getComponentType(rawQuestion: RawQuestion): ComponentTypes {
    if (!this.questionType) {
      console.warn('Missing question type', rawQuestion);
      return ComponentTypes.textField;
    }

    const formatComponentType = this.getComponentTypeByFormat();

    if (formatComponentType) {
      return formatComponentType;
    }

    const uniqueNameComponentType = this.getComponentTypeByUniqueName(rawQuestion);

    if (uniqueNameComponentType) {
      return uniqueNameComponentType;
    }

    return this.getComponentTypeByQuestionType(rawQuestion);
  }

  private getComponentTypeByFormat(): ComponentTypes {
    switch (this.questionFormat) {
      case QuestionFormat.phone:
        return ComponentTypes.phoneNumber;
    }
  }

  private getComponentTypeByUniqueName(rawQuestion: RawQuestion): ComponentTypes {
    const uniqueName = rawQuestion.fieldMapping
      ? rawQuestion.fieldMapping[0]?.uniqueName || null
      : null;

    if (!uniqueName) {
      return null;
    }

    switch (uniqueName) {
      case OnwardQuestionUniqueNames.firstPriorityWithWhomWantToGo:
        return ComponentTypes.peerQuestion;
      case OnwardQuestionUniqueNames.emergencyContact:
        return ComponentTypes.emergencyQuestion;
    }
  }

  private getComponentTypeByQuestionType(rawQuestion: RawQuestion): ComponentTypes {
    switch (this.questionType) {
      case QuestionTypes.address:
        return ComponentTypes.googleAddress;

      case QuestionTypes.hidden:
      case QuestionTypes.openQuestion:
        return ComponentTypes.textField;

      case QuestionTypes.multiChoiceQuestion:
        return ComponentTypes.checkboxes;

      case QuestionTypes.singleChoiceQuestion:
        return rawQuestion.options.length === 2
          ? ComponentTypes.radioButtons
          : ComponentTypes.dropdown;

      case QuestionTypes.documentUpload:
      case QuestionTypes.profilePicture:
        return ComponentTypes.fileInput;

      case QuestionTypes.waiver:
        return ComponentTypes.waiver;

      case QuestionTypes.essay:
        return ComponentTypes.textArea;

      case QuestionTypes.paragraph:
        return ComponentTypes.paragraph;

      case QuestionTypes.medicalDiagnosis:
        return ComponentTypes.medicalDiagnosis;
      case QuestionTypes.repetitiveQuestion:
        return ComponentTypes.repetitiveQuestion;
      case QuestionTypes.repetitiveButton:
        return ComponentTypes.repetitiveButton;

      case QuestionTypes.dropdown:
      case QuestionTypes.dropdownFromDb:
        return ComponentTypes.dropdown;

      case QuestionTypes.dropdownWithFlag:
        return ComponentTypes.dropdownWithFlag;

      case QuestionTypes.phoneNumberInput:
        return ComponentTypes.phoneNumber;

      case QuestionTypes.priorityMultiChoice:
        if (useProduct().isExcel.value) {
          return ComponentTypes.internshipSelection;
        }
        break;

      case QuestionTypes.datePicker:
        return ComponentTypes.datePicker;

      case QuestionTypes.passportScan:
        return ComponentTypes.passportScan;

      default:
        console.warn('Unknown question type', rawQuestion);
        return ComponentTypes.textField;
    }
  }

  private getMask(): string {
    switch (this.questionFormat) {
      //  removed the phone because we cannot predict how many digits the user will enter
      case QuestionFormat.date:
        return '##/##/####';
      case QuestionFormat.phone:
        return useProduct().isOnward.value ? '###-###-######' : '';
      default:
        return '';
    }
  }

  private getRules(rawQuestion: RawQuestion): Rules {
    let rules: Rules = {};

    rules = getLanguageRules(rules, rawQuestion.languageRestriction);

    rules = getRulesByQuestionUniqueName(rules, this);

    rules = getRulesByQuestionRules(rules, rawQuestion.rules, this);

    rules = getRulesByQuestionFormat(rules, this);

    return rules;
  }

  private getUniqueName(rawQuestion: RawQuestion): string {
    if (!rawQuestion.fieldMapping || !rawQuestion.fieldMapping.length) {
      return 'no mapping';
    }
    return rawQuestion.fieldMapping[0].uniqueName || rawQuestion.fieldMapping[0].fieldName; // for data-qa-id
  }

  private getFieldName(rawQuestion: RawQuestion): string {
    if (!rawQuestion.fieldMapping || !rawQuestion.fieldMapping.length) {
      return 'no mapping';
    }
    return rawQuestion.fieldMapping[0].fieldName || 'no mapping';
  }

  private getObjectName(rawQuestion: RawQuestion): string {
    if (!rawQuestion.fieldMapping || !rawQuestion.fieldMapping.length) {
      return 'no mapping';
    }
    return rawQuestion.fieldMapping[0].objectName || 'no mapping';
  }

  public resetValue(): void {
    this.value = '';
  }

  public fillInput(value: string): void {
    if (value) {
      this.value = value;
    }
  }

  private getKey(): string {
    if (this.isClone) {
      const splitId = this.id.split('-');
      splitId.pop();

      return splitId.join('-');
    } else {
      return this.id;
    }
  }
}
