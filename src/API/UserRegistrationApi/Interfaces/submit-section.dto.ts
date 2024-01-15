import { UploadedFile, UserAnswer } from "../../../Types";

export interface SubmitSectionDto {
  formSectionId: string;
  userAnswers: UserAnswer[];
  uploadedFiles: UploadedFile[];
  contactId: string;
  applicationId: string;
  countryIsoCode: string;

  partialSubmit?: boolean;
  throwError?: boolean;
  isPhase2Submission?: boolean;
}
