import { RawUniversityOption } from "registration-secret-sauce";
import { OptionInterface } from "registration-secret-sauce";
import { IsVisible } from "../BaseClasses/is-visible";

export class UniversityOption extends IsVisible implements OptionInterface {
  public id: string;
  public sort: number;
  public value: string;
  public countryIsoCode: string;

  constructor(rawOption: RawUniversityOption, index: number) {
    super();
    this.id = String(index);
    this.sort = rawOption.sort;
    this.label = rawOption.name;
    this.value = rawOption.value;
    this.countryIsoCode = rawOption.countryIsoCode;
    this.isVisible = true;
  }
}
