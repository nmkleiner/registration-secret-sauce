import { RawFormSection } from "registration-secret-sauce";
import { FormSection } from "../Entities/Section";
import { useProduct } from "../../../excel-registration-front/src/Core/Composables/program/useProduct";
// import { excelFormSectionFactory } from '@/Modules/Excel/Factories/excel-form-section.factory';
import { onwardFormSectionFactory } from "../../../excel-registration-front/src/Modules/Onward/Factories/onward-form-section.factory";
import { RegistrationTab } from "../Entities/Tab/registration-tab";

export function formSectionFactory(
  rawFormSection: RawFormSection,
  tab: RegistrationTab
): FormSection {
  // if (useProduct().isExcel.value) {
  //   const excelFormSection = excelFormSectionFactory(rawFormSection, tab);
  //   if (excelFormSection) {
  //     return excelFormSection;
  //   }
  // }

  if (useProduct().isOnward.value) {
    const onwardFormSection = onwardFormSectionFactory(rawFormSection, tab);
    if (onwardFormSection) {
      return onwardFormSection;
    }
  }

  return new FormSection(rawFormSection, tab);
}
