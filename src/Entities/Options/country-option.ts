import { OptionInterface } from '../../Interfaces/Form/Inputs/option.interface';
import { RawCountryOption } from '../../Interfaces/raw-country-option.interface';
import { IsVisible } from '../BaseClasses/is-visible';

export class CountryOption extends IsVisible implements OptionInterface {
  public id: string;
  public sort: number;
  public value: string;
  public isoCode: string;
  public areaCode: string;
  public dateFormat: string;

  constructor(rawOption: RawCountryOption, index: number) {
    super();
    this.id = String(index);
    this.sort = rawOption.sort;
    this.label = rawOption.name;
    this.value = rawOption.value;
    this.isoCode = rawOption.value;
    this.areaCode = rawOption.areaCode;
    this.isVisible = true;
    this.dateFormat = rawOption.dateFormat;
  }
}
