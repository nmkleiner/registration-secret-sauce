import {DocumentStatus,DocumentType} from "../Enums";

export type ContactData = {
  documents: UserDocument[];
  phase2Documents: UserPhase2Document[];
} & ContactInformation;

export interface ContactInformation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  profilePicture: string;
  mailingCountry: string;
  mailingCountryCode: string;
  gender: string;
  secondaryEmail: string;
  countryOfBirth: string;
  mobilePhone: string;
  hasLivingParent: boolean;
}

export interface UserDocument {
  id: string;
  formId: string;
  value?: string;
  isDocument?: boolean;
  type?: DocumentType;
  documentStatus?: DocumentStatus;
}

export interface UserPhase2Document {
  type?: string;
  File_Name: string;
  fileIndex: string;
  Document_URL: string;
  Readable_URL: string;
  Short_File_Name: string;
  isPhase2Document?: true;
  isPhase2DocumentV2?: true;
}
