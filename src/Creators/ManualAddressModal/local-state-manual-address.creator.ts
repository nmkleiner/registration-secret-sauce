import { translate } from "../../../../excel-registration-front/src/Core/Translations/vue-i18n";
import { QuestionTypes } from "registration-secret-sauce";
import { formElementsFactory } from "../../Factories/form-elements.factory";
import { BasicInput } from "../../Entities/FormElements";
import { ValidationRules } from "../../../../excel-registration-front/src/Core/Validation/rules";
import { AddressFields } from "registration-secret-sauce";
import { QuestionUniqueNames } from "registration-secret-sauce";
import { AddressInput } from "../../Entities/FormElements/address-input";

export const manualAddressInputsCreator = (
  addressInput: AddressInput
): Record<AddressFields, BasicInput> => {
  const questions = [
    {
      id: AddressFields.country,
      name: translate("addressModal.country"),
      value: addressInput.addressValue?.country || "",
      type: { id: QuestionTypes.dropdownFromDb, name: "Dropdown From DB" },
      displayColumnNumber: 1,
      fieldMapping: [
        {
          uniqueName: QuestionUniqueNames.mailingCountryEditProfile,
          fieldName: "",
        },
      ],
      rules: [
        { rule: { programmaticName: ValidationRules.required }, value: "true" },
      ],
    },
    {
      id: AddressFields.zipCode,
      name: translate("addressModal.zipCode"),
      value: addressInput.addressValue?.zipCode || "",
      type: { id: QuestionTypes.openQuestion, name: "Open question" },
      displayColumnNumber: 1,
      fieldMapping: [
        {
          uniqueName: "",
          fieldName: "",
        },
      ],
      rules: [
        { rule: { programmaticName: ValidationRules.required }, value: "true" },
      ],
    },
    {
      id: AddressFields.city,
      name: translate("addressModal.city"),
      value: addressInput.addressValue?.city || "",
      type: { id: QuestionTypes.openQuestion, name: "Open question" },
      displayColumnNumber: 1,
      fieldMapping: [
        {
          uniqueName: "",
          fieldName: "",
        },
      ],
      rules: [
        { rule: { programmaticName: ValidationRules.required }, value: "true" },
      ],
    },
    {
      id: AddressFields.state,
      name: translate("addressModal.state"),
      value: addressInput.addressValue?.state || "",
      type: { id: QuestionTypes.dropdownFromDb, name: "Dropdown from DB" },
      displayColumnNumber: 1,
      fieldMapping: [
        {
          uniqueName: QuestionUniqueNames.state,
          fieldName: "",
        },
      ],
      rules: [
        { rule: { programmaticName: ValidationRules.required }, value: "true" },
      ],
    },
    {
      id: AddressFields.streetAddress,
      name: translate("addressModal.street"),
      value: addressInput.addressValue?.streetAddress || "",
      type: { id: QuestionTypes.openQuestion, name: "Open Question" },
      displayColumnNumber: 1,
      fieldMapping: [
        {
          uniqueName: "",
          fieldName: "",
        },
      ],
      rules: [
        { rule: { programmaticName: ValidationRules.required }, value: "true" },
      ],
    },
  ];

  const inputs = questions.map((question) =>
    formElementsFactory(question, { name: "edit profile", columns: 1 })
  );

  return {
    [AddressFields.country]: inputs[0],
    [AddressFields.zipCode]: inputs[1],
    [AddressFields.city]: inputs[2],
    [AddressFields.state]: inputs[3],
    [AddressFields.streetAddress]: inputs[4],
  };
};
