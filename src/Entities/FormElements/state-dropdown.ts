import { RawQuestion } from "registration-secret-sauce";
import { InputWithOptions } from "./index";
import { useDropdownOptionsStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/DropdownOptions/dropdown-options.store";
import { BaseSectionInterface } from "../Section/section.interface";
import { StateOption } from "../Options/state-option";

export class StateDropdown extends InputWithOptions {
  declare options: StateOption[];

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.handleEmptyOptions();
  }

  public filterOptionsByCountry(countryIsoCode: string) {
    this.options = useDropdownOptionsStore().dbOptions.states.filter(
      (option) => option.countryIsoCode === countryIsoCode
    );
    this.options.length ? this.show() : this.hide();
  }

  buildOptions(rawQuestion: RawQuestion): StateOption[] {
    return useDropdownOptionsStore().dbOptions.states;
  }

  handleEmptyOptions() {
    if (!this.options.length) {
      this.hide();
    }
  }
}
