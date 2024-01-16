import { RegistrationStage } from "registration-secret-sauce";
import { RawFormSection } from "registration-secret-sauce";
import { sortObjectsByProperty } from "../../../excel-registration-front/src/Core/Helpers/sort-objects-by-property";
import { RegistrationTab } from "../Entities/Tab/registration-tab";

export function registrationTabFactory(
  stages: RegistrationStage[],
  sections: RawFormSection[]
) {
  const registrationTabs = stages.map((stage) => {
    const stageSections = sections.filter(
      (section) => section.formStageId === stage.id
    );
    const orderedSections = sortObjectsByProperty(stageSections, "order");

    return new RegistrationTab(stage, orderedSections);
  });

  return registrationTabs;
}
