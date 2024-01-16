// import router from '@/Modules/Common/Router';
import { FormSection } from "./index";
import { translate } from "../../../../excel-registration-front/src/Core/Translations/vue-i18n";
import { RawFormSection } from "registration-secret-sauce";
// import { ExcelPathNames } from '@/Modules/Excel/Router/path-names.enum';
// import ExcelGoogleTagManager from '@/Modules/Excel/Managers/ExcelGoogleTagManager/excel-google-tag.manager';
import { RegistrationTab } from "../Tab/registration-tab";
import { useProduct } from "../../../../excel-registration-front/src/Core/Composables/program/useProduct";
import { usePaymentStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Payment/payment.store";

export class SubmitFormSection extends FormSection {
  constructor(rawFormSection: RawFormSection, tab: RegistrationTab) {
    super(rawFormSection, tab);
  }

  public async save(): Promise<void> {
    await super.save();
    // if (useProduct().isExcel.value) {
    //   await router.push({ name: ExcelPathNames.Profile });
    // }
  }

  public calculateSaveButtonText() {
    return useProduct().isOnward.value
      ? translate("general.buttons.submit")
      : translate("saveButtons.submit");
  }

  public get saveButtonActive() {
    if (useProduct().isOnward.value) {
      return !this.isCompleted && !usePaymentStore().allowPayment;
    }
    return !this.isCompleted;
  }

  // protected fireGoogleTagManagerEvent() {
  // ExcelGoogleTagManager.fireSubmitApplicationEvent();
  // }
}
