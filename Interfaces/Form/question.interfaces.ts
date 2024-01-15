import { QuestionOption } from './option.interfaces';
import { QuestionRule, RuleMessage } from './rule.interfaces';
import {
  OptionCondition,
  SectionOptionCondition,
} from './option-condition.interfaces';
import { Address } from './Inputs/address.interface';
import { RepetitiveQuestionValue } from './Inputs/repetitive-question-value.interface';
import {RawMedicalCondition} from "../../Types";
import {QuestionFormat} from "../../Enums";

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

export enum Languages {
  EnglishWithNumbers = 'EnglishWithNumbers',
  English = 'English',
  Hebrew = 'Hebrew',
  Russian = 'Russian',
  Spanish = 'Spanish',
  French = 'French',
  German = 'German',
  Portuguese = 'Portuguese',
  Hungarian = 'Hungarian',
  Polish = 'Polish',
}

/*
 * sourced from: https://polish.typeit.org/
 * */
export const LanguagesRegexes = {
  EnglishWithNumbers: /^[a-zA-Z0-9 '`"-]+$/,
  English: /^[(a-zA-Z\s)][a-zA-Z\s]*$/,
  Hebrew: /[(.אבגדהוזחטיכלמנסעפצקרשתךםןץף\s)]/,
  Russian: /[(ёъяшертыуиопющэжьлкйчгфдсазхцвбнмЁЯШЕРТЫУИОПЮЩЭЖЬЛКЙЧГФДСАЗХЦВБНМ.\s)]/,
  Spanish: /[(a-zA-ZñáéíóúüÁÉÍÑÓÚÜ.\s)]/,
  French: /[(a-zA-ZùûüÿàâæçéèêëïîôœÙÛÜŸÀÂÆÇÉÈÊËÏÎÔŒ.\s)]/,
  German: /[(a-zA-ZäöüßÄÖÜẞ.\s)]/,
  Portuguese: /[(a-zA-ZãáàçâéêíõóôúüÃÁÀÂÇÉÊÍÕÓÔÚÜ.\s)]/,
  Hungarian: /[(a-zA-áéúőóüöÁÉÍÖÓŐÜÚŰ.\s)]/,
  Polish: /[(a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ.\s)]/,
};
