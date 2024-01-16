import { RawQuestion } from '../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Entities/Section/section.interface';
import {
  BasicInput,
  InputWithMultiSelect,
  InputWithOptions,
} from '../Entities/FormElements';
import { QuestionTypes } from '../Enums/input-types.enum';
import { FileInput } from '../Entities/FormElements/file-input';
import { QuestionFormat } from '../Enums/question-format.enum';
import { DateInput } from '../Entities/FormElements/date-input';
import { AddressInput } from '../Entities/FormElements/address-input';
import { useProduct } from '../../../excel-registration-front/src/Core/Composables/program/useProduct';
import { excelFormElementsFactory } from '../../../excel-registration-front/src/Modules/Excel/Factories/excel-form-elements.factory';
import { onwardFormElementsFactory } from '../../../excel-registration-front/src/Modules/Onward/Factories/onward-form-elements.factory';
import PassportScanInput from '../Entities/FormElements/passport-scan-input';
import { RepetitiveQuestion } from '../Entities/FormElements/repetitive-question';
import { RepetitiveButton } from '../Entities/FormElements/repetitive-button';
import { HiddenInput } from '../Entities/FormElements/hidden-input';
import { MedicalDiagnosis } from '../Entities/FormElements/medical-diagnosis';
import { PhoneInput } from '../Entities/FormElements/phone-input';

/*
 * Called from creators and form-sections
 *
 * Calls Excel Factory first if program is Excel
 * This returns An Input Instance that is unique to Excel or null
 *
 * Calls Onward Factory first if program is Onward
 * This returns An Input Instance that is unique to Onward or null
 *
 * Creates Input instance by Format or Type
 *
 * */
export function formElementsFactory(
  rawQuestion: RawQuestion,
  formSection: BaseSectionInterface,
): BasicInput {
  if (useProduct().isExcel.value) {
    const excelFormElement = excelFormElementsFactory(rawQuestion, formSection);
    if (excelFormElement) {
      return excelFormElement;
    }
  }

  if (useProduct().isOnward.value) {
    const onwardFormElement = onwardFormElementsFactory(rawQuestion, formSection);
    if (onwardFormElement) {
      return onwardFormElement;
    }
  }

  const formElementByFormat = createFormElementByQuestionFormat(rawQuestion, formSection);

  if (formElementByFormat) {
    return formElementByFormat;
  }

  return createFormElementByQuestionType(rawQuestion, formSection);
}

function createFormElementByQuestionType(
  rawQuestion: RawQuestion,
  formSection: BaseSectionInterface,
): BasicInput {
  switch (rawQuestion.type.id) {
    case QuestionTypes.openQuestion:
      return new BasicInput(rawQuestion, formSection);

    case QuestionTypes.singleChoiceQuestion:
    case QuestionTypes.dropdown:
      return new InputWithOptions(rawQuestion, formSection);

    case QuestionTypes.waiver:
    case QuestionTypes.multiChoiceQuestion:
      return new InputWithMultiSelect(rawQuestion, formSection);

    case QuestionTypes.documentUpload:
    case QuestionTypes.profilePicture:
      return new FileInput(rawQuestion, formSection);

    case QuestionTypes.address:
      return new AddressInput(rawQuestion, formSection);

    case QuestionTypes.datePicker:
      return new DateInput(rawQuestion, formSection);

    case QuestionTypes.passportScan:
      return new PassportScanInput(rawQuestion, formSection);

    case QuestionTypes.medicalDiagnosis:
      return new MedicalDiagnosis(rawQuestion, formSection);
    case QuestionTypes.repetitiveQuestion:
      return new RepetitiveQuestion(rawQuestion, formSection);
    case QuestionTypes.repetitiveButton:
      return new RepetitiveButton(rawQuestion, formSection);
    case QuestionTypes.hidden:
      return new HiddenInput(rawQuestion, formSection);
    case QuestionTypes.phoneNumberInput:
      return new PhoneInput(rawQuestion, formSection);

    case QuestionTypes.essay:
    case QuestionTypes.paragraph:
    case QuestionTypes.privacyPolicy:
    case QuestionTypes.header:
    case QuestionTypes.rangePicker:
    default:
      return new BasicInput(rawQuestion, formSection);
  }
}

function createFormElementByQuestionFormat(
  rawQuestion: RawQuestion,
  formSection: BaseSectionInterface,
): BasicInput {
  if (!rawQuestion.format) {
    return null;
  }

  switch (rawQuestion.format.id) {
    case QuestionFormat.date:
      return new DateInput(rawQuestion, formSection);
    case QuestionFormat.phone:
      return useProduct().isOnward.value ? new PhoneInput(rawQuestion, formSection) : null;
    default:
      return null;
  }
}
