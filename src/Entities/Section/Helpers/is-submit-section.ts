import { FormSection } from "../index";
import { SubmitFormSection } from "../submit-form-section";

export function isSubmitSection(
  section: FormSection
): section is SubmitFormSection {
  return section instanceof SubmitFormSection;
}
