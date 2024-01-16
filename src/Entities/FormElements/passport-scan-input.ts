import { BasicInput } from './index';
import { RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import FormBuilderApi from '../../API/FormBuilderApi/form-builder.api';
import { useModalsStore } from '../../Stores/Modals/modals.store';
import { ModalNames } from '../../Stores/Modals/modals-state.interface';
import { useUserStore } from '../../Stores/User/user.store';

export default class PassportScanInput extends BasicInput {
  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }
  public async sendSms(phoneNumber: string) {
    const activeCountryIsoCode = useUserStore().contactInformation.mailingCountryCode;
    const success = await FormBuilderApi.sendSMS(phoneNumber, activeCountryIsoCode);

    if (!success) {
      useModalsStore().closeModal(ModalNames.error);
      useModalsStore().openModal(ModalNames.invalidPhoneNumber);
      return false;
    }

    return true;
  }
}
