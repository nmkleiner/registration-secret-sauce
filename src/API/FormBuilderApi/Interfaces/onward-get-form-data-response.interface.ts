import { ContactData } from '../../../../../../../registration-secret-sauce/Interfaces';
import { ApplicationData } from '@/Modules/Problems/Interfaces/application-data.interfaces';
import { DropdownsFromDB } from '../../../../../../../registration-secret-sauce/Interfaces';
import { BaseFormDataResponse } from '@/Modules/Common/API/FormBuilderApi/Interfaces/get-form-data-base.interface';

export interface OnwardFormDataResponse extends BaseFormDataResponse {
  type: 'ONWARD';
  settings: Record<string, string>;
  contactData: ContactData;
  applicationData: ApplicationData['ONWARD'];
  dropdownsFromDB: DropdownsFromDB['ONWARD'];
  isControlQuestionsPopUpActive: boolean;
}
