import { BasicInput } from "../../Entities/FormElements/basic-input";
import { QuestionTypes } from "registration-secret-sauce";
import { translate } from "../../../../excel-registration-front/src/Core/Translations/vue-i18n";
import { RawQuestion } from "registration-secret-sauce";
import { formElementsFactory } from "../../Factories/form-elements.factory";
import { QuestionFormat } from "registration-secret-sauce";

export const loginLocalStateCreator = (): BasicInput => {
  const question: RawQuestion = {
    id: "email",
    name: translate("excelLoginPage.loginPanel.email"),
    value: "",
    type: { id: QuestionTypes.openQuestion, name: "Open Question" },
    rules: [
      { rule: { programmaticName: "required" }, value: "true" },
      { rule: { programmaticName: "email" }, value: "true" },
    ],
    displayColumnNumber: 1,
    format: { name: "email", id: QuestionFormat.email },
  };
  return formElementsFactory(question, { name: "contact us", columns: 1 });
};

export const adminLoginLocalStateCreator = (): BasicInput => {
  const question: RawQuestion = {
    id: "email",
    name: translate("excelLoginPage.loginPanel.password"),
    value: "",
    type: { id: QuestionTypes.openQuestion, name: "Open Question" },
    rules: [{ rule: { programmaticName: "required" }, value: "true" }],
    displayColumnNumber: 1,
  };
  return formElementsFactory(question, { name: "contact us", columns: 1 });
};
