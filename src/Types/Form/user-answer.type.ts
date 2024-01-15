import { PriorityInput } from "./priority-input.type.ts";
import { UserInput } from "./user-input.type.ts";
import { UploadPhase2FilesResponseDto } from "../../../excel-registration-front/src/Modules/Common/API/UploadFilesApi/Interfaces/upload-secure-files.response";

export type UserAnswer =
  | StandardUserAnswer
  | MedicalDiagnosisUserAnswer
  | DuplicatedUserAnswer;

export interface StandardUserAnswer {
  key: string;
  value: UserInput;
}

export interface CancelMedical {
  Id: string;
  name: string;
}

export interface RawMedicalCondition {
  Form_Id__c: string;
  Id: string;
  Medical_Condition_Type__c: string;
  Medical_Condition_Status__c: string;
  Medicines__r: {
    records: RawMedicine[];
  };
}

export interface RawMedicine {
  Medicine_Name__c: string;
  Dosage__c: string;
  Medicine_Special_Instructions__c: string;
  Form_Id__c: string;
  Id: string;
}

export interface MedicalDiagnosisUserAnswer {
  MedicalDiagnosis: true;
  MedicalConditions: MedicalConditionAnswer[];
  CancelledMedicalConditions: CancelMedical[];
}
export interface DuplicateCondition {
  key: string;
  value: string;
}

export interface MedicalConditionAnswer {
  condition: string;
  values: {
    duplicatedValues: DuplicateCondition[][];
    cancelledValues: DuplicateCondition[][];
  };
}

export interface DuplicatedUserAnswer {
  duplicatedAnswers: true;
  values: StandardUserAnswer[][];
  cancelledValues: StandardUserAnswer[][];
}

export type ConsularCheckFileUserAnswer = StandardUserAnswer &
  UploadPhase2FilesResponseDto & {
    type: string;
    formId: string;
    fileIndex: string;
    isPhase2Document: true;
    isPhase2DocumentV2: true;
  };

export interface FileUserAnswer extends StandardUserAnswer {
  value: File;
  isDocument: true;
  type: string;
}

export interface JobOfferingUserAnswer extends StandardUserAnswer {
  isJobOffering: boolean;
  value: PriorityInput[];
}

export interface UploadedFile {
  isIsraeliPassport: boolean;
  bucket_name: string;
  fileTopic: string;
  formId: string;
  id: string;
  key: string;
}
