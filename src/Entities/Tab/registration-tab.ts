import { RegistrationStage } from "registration-secret-sauce";
import { RawFormSection } from "registration-secret-sauce";
import { FormSection } from "../Section";
import { formSectionFactory } from "../../Factories/form-section.factory";
import { isEmpty } from "lodash-es";
import { IsLocked } from "../BaseClasses/is-locked";
import { useFormNavigationStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/FormNavigation/form-navigation.store";

export class RegistrationTab extends IsLocked {
  public key: string;
  public icon: string;
  public text: string;
  public order: number;
  public uniqueName: string;
  public sections: FormSection[];
  public isSelected = false;
  public completed = false;
  public notCompleted = false;
  public resourceId: number;

  constructor(settings: RegistrationStage, sections: RawFormSection[]) {
    super();
    this.icon = settings.icon;
    this.text = settings.label;
    this.order = settings.order;
    this.uniqueName = settings.name;
    this.key = settings.translation_key;
    this.resourceId = settings.resource_id;
    this.sections = this.buildSections(sections);
    this.evaluateCompleted();
    this.openFirstSection();
  }

  public select() {
    this.isSelected = true;
  }

  public unselect() {
    this.isSelected = false;
  }

  public setNotCompleted(notCompleted: boolean) {
    this.notCompleted = notCompleted;
  }

  public evaluateCompleted(): void {
    if (this.notCompleted) {
      this.completed = false;
    }

    this.completed = this.sections?.every((section) => section.isCompleted);

    if (this.completed) {
      useFormNavigationStore().evaluateOnwardTabsLockStatus();
    }
  }

  public setIcon(icon: string) {
    this.icon = icon;
  }

  public focus(): RegistrationTab {
    return this;
  }

  public buildSections(sections: RawFormSection[]) {
    return sections.map((section) => formSectionFactory(section, this));
  }

  private openFirstSection() {
    if (isEmpty(this.sections)) {
      return;
    }
    this.sections[0].open();
  }
}
