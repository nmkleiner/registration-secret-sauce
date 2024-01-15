export enum SectionNames {
  submitPhase1 = 'Deposit',
  waiver = 'Waiver',
  submitPhase2 = 'SubmissionPhase2',
  medical = 'InsuranceCompanyInformation',
  applicantDetails = 'ApplicantDetails',
  myTrip = 'MyTrip',
  jewishBackground = 'JewishBackground',
  documentUpload = 'DocumentUpload',
}

export const SubmitSectionUniqueNames = [SectionNames.submitPhase1, SectionNames.submitPhase2];

export const sectionsWithLoaderOnSave = [
  SectionNames.submitPhase1,
  SectionNames.submitPhase2,
  SectionNames.waiver,
  SectionNames.medical,
];
