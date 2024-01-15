export enum ComponentTypes {
  googleAddress = 'address',
  checkboxes = 'checkboxes',
  dropdown = 'dropdown',
  fileInput = 'fileInput',
  paragraph = 'paragraph',
  radioButtons = 'radioButtons',
  textArea = 'textArea',
  textField = 'textField',
  datePicker = 'datePicker',
  // UniqueInputs
  waiver = 'waiver',
  internshipSelection = 'internshipSelection',
  passportScan = 'passportScan',
  peerQuestion = 'peerQuestion',
  dropdownWithFlag = 'dropdownWithFlag',
  medicalDiagnosis = 'medicalDiagnosis',
  repetitiveButton = 'repetitiveButton',
  repetitiveQuestion = 'repetitiveQuestion',
  emergencyQuestion = 'emergencyQuestion',
  phoneNumber = 'phoneNumber',
  textWithFlag = 'textWithFlag',
}

export enum QuestionTypes {
  openQuestion = 1,
  multiChoiceQuestion = 2,
  singleChoiceQuestion = 3,
  documentUpload = 4,
  profilePicture = 8,
  waiver = 5,
  essay = 6,
  dropdown = 7,
  paragraph = 12,
  medicalDiagnosis = 14,
  repetitiveQuestion = 15,
  repetitiveButton = 16,
  dropdownFromDb = 17,
  hidden = 18,
  priorityMultiChoice = 21,
  privacyPolicy = 9,
  datePicker = 10,
  header = 19,
  address = 20,
  rangePicker = 22,
  passportScan = 32,
  dropdownWithFlag = 1030,
  phoneNumberInput = 1031,
  textWithFlag = 1031,

}

export const EXCEL_SAVE_BUTTON_OFF_LIST = ['MyTrip'];
export const ONWARD_SAVE_BUTTON_OFF_LIST = ['PassportInformation'];
