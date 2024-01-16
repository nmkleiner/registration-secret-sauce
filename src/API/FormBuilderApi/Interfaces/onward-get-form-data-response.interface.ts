import { ContactData } from '../../../Interfaces/contact-data.interfaces';
import { ApplicationData } from '../../../Interfaces/application-data.interfaces';
import { DropdownsFromDB } from '../../../Interfaces/dropdowns-from-db.interface';
import { BaseFormDataResponse } from './get-form-data-base.interface';

export interface OnwardFormDataResponse extends BaseFormDataResponse {
  type: 'ONWARD';
  settings: Record<string, string>;
  contactData: ContactData;
  applicationData: ApplicationData['ONWARD'];
  dropdownsFromDB: DropdownsFromDB['ONWARD'];
  isControlQuestionsPopUpActive: boolean;
}
