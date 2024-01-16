import { RawStateOption } from "registration-secret-sauce";
import { OptionInterface } from "registration-secret-sauce";
import { IsVisible } from "../BaseClasses/is-visible";

export class StateOption extends IsVisible implements OptionInterface {
  public id: string;
  public sort: number;
  public value: string;
  public code: string;
  public countryIsoCode: string;

  constructor(rawOption: RawStateOption, index: number) {
    super();
    this.id = String(index);
    this.sort = rawOption.sort;
    this.label = rawOption.name;
    this.value = rawOption.code;
    this.code = rawOption.code;
    this.countryIsoCode = rawOption.countryIsoCode;
    this.isVisible = true;
  }
}
