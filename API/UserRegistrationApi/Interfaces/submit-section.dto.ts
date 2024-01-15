import {
  UploadedFile,
  UserAnswer,
} from '../../../../../../../registration-secret-sauce/Types/Form/user-answer.type';

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
