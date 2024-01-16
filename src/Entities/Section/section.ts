import { IsOpen } from '../BaseClasses/is-open';
import { translate } from '../../../../excel-registration-front/src/Core/Translations/vue-i18n';
import { SectionInterface } from './section.interface';
import { BasicInput } from '../FormElements';

export class Section extends IsOpen implements SectionInterface {
  public name: string;
  public inputs: BasicInput[];
  public columns: number = 3;
  public saveButtonText: string;

  constructor(name: string, inputs?: BasicInput[]) {
    super();
    this.name = name;
    this.inputs = inputs;
    this.saveButtonText = this.calculateSaveButtonText();
  }

  public async save(values: unknown) {
    console.log(values);
  }

  public calculateSaveButtonText() {
    return translate('saveButtons.save');
  }
}
