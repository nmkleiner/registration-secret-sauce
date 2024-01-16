import { RawQuestion } from './question.interfaces';
import { ExcelSectionNames } from '../../../../excel-registration-front/src/Modules/Excel/Enums/excel-section-names.enum';

export interface RawFormSection {
  id: string;
  name: string;
  order: number;
  description: string;
  isSaveLock: boolean;
  formStageId: number;
  completedAt: string;
  isLockOnSubmit: boolean;
  numberOfColumns: number;
  mappings: SectionMapping;
  formFields: RawQuestion[];
  registrationPhase: number;
  isEditAfterSubmit: boolean;
  isPartialSaveAllowed: boolean;
}

export interface SectionMapping {
  fieldName: string;
  objectName: string;
  sectionName: string;
  uniqueName: ExcelSectionNames;
}
