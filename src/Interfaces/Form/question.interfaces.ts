import { QuestionOption } from "./option.interfaces";
import { QuestionRule, RuleMessage } from "./rule.interfaces";
import {
  OptionCondition,
  SectionOptionCondition,
} from "./option-condition.interfaces";
import { Address } from "./Inputs/address.interface";
import { RepetitiveQuestionValue } from "./Inputs/repetitive-question-value.interface";
import { RawMedicalCondition } from "../../Types";
import { Languages, QuestionFormat } from "../../Enums";

export interface BaseRawQuestion {
  id: string;
  name: string;
  value: string | RepetitiveQuestionValue | Address | RawMedicalCondition[];
  type: QuestionType;
  rules: QuestionRule[];
  displayColumnNumber: number;
  displayPhonePrefix?: boolean;
}

export interface RawQuestion extends BaseRawQuestion {
  hint?: string;
  sort?: number;
  resourceId?: number;
  format?: FieldFormat;
  fileTopic?: FileTopic;
  displayInBox?: number;
  fileTypes?: RawFileType[];
  options?: QuestionOption[];
  ruleMessages?: RuleMessage[];
  fieldMapping?: FieldMapping[];
  isAdditionalQuestion?: boolean;
  languageRestriction?: RawLanguage;
  optionConditions?: OptionCondition[];
  sectionOptionConditions?: SectionOptionCondition[];
}

export interface LocalRawQuestion extends RawQuestion {
  readonly: boolean;
}

export interface QuestionType {
  id: number;
  resourceId?: number;
  name: string;
}

export interface FieldFormat {
  name: string;
  id: QuestionFormat;
  mask?: string;
}

export interface FileTopic {
  name: string;
  resourceId: number;
}

export interface RawFileType {
  type: string;
}

export interface FieldMapping {
  uniqueName: string;
  fieldName: string;

  objectName?: string;
  excelObjectName?: string;
  excelFieldName?: string;
  excelUniqueName?: string;
}

export interface RawLanguage {
  name: Languages;
}
