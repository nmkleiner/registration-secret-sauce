export type ModalsState = {
  modals: {
    [key in ModalNames]: {
      ref: HTMLDialogElement;
      label?: string;
    };
  };
};

export enum ModalNames {
  error = 'error',
  waiver = 'waiver',
  editProfile = 'editProfile',
  internship = 'internship',
  pleaseWait = 'pleaseWait',
  profilePicture = 'ProfilePicture',
  underMinAge = 'underMinAge',
  imageFileType = 'imageFileType',
  maxFileSizeError = 'maxFileSizeError',
  unavailableSeason = 'unavailableSeason',
  permissionsAgreement = 'permissionsAgreement',
  uploadWaitFileModal = 'uploadWaitFileModal',
  invalidPhoneNumber = 'invalidPhoneNumber',
  passportScanModal = 'passportScanModal',
  submitErrorModal = 'submitErrorModal',
  myProgramsModal = 'myProgramsModal'
}
