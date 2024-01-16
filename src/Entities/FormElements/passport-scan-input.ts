import { BasicInput } from "./index";
import { RawQuestion } from "registration-secret-sauce";
import { BaseSectionInterface } from "../Section/section.interface";
import FormBuilderApi from "registration-secret-sauce";
import { useModalsStore } from "registration-secret-sauce";
import { ModalNames } from "registration-secret-sauce";
import { useUserStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/User/user.store";

export default class PassportScanInput extends BasicInput {
  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }
  public async sendSms(phoneNumber: string) {
    const activeCountryIsoCode =
      useUserStore().contactInformation.mailingCountryCode;
    const success = await FormBuilderApi.sendSMS(
      phoneNumber,
      activeCountryIsoCode
    );

    if (!success) {
      useModalsStore().closeModal(ModalNames.error);
      useModalsStore().openModal(ModalNames.invalidPhoneNumber);
      return false;
    }

    return true;
  }
}
