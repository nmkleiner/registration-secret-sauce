import { RawForm } from '../../../Interfaces/Form/form.interface';
import { RegistrationStage } from '../../../Interfaces/Form/registration.stage.interface';
import { SeasonSetting } from '../../../Interfaces/season-setting.interface';
import { RawSeason } from '../../../Interfaces/raw-season.interface';
import { ContactData } from '../../../Interfaces/contact-data.interfaces';
import { ApplicationData } from '../../../Interfaces/application-data.interfaces';
import { DropdownsFromDB } from '../../../Interfaces/dropdowns-from-db.interface';
import { OnwardFormDataResponse } from './onward-get-form-data-response.interface';
import { ExcelFormDataResponse } from './excel-get-form-data-response.interface';

export interface BaseFormDataResponse {
  type: 'EXCEL' | 'ONWARD';
  form: RawForm;
  registrationStages: RegistrationStage[];
  contactData: ContactData;
  applicationData: ApplicationData['EXCEL' | 'ONWARD'];
  dropdownsFromDB: DropdownsFromDB['EXCEL' | 'ONWARD'];

  availableSeasons: RawSeason[];
  applicationSeasonSetting: SeasonSetting;
  formSeasonSetting: SeasonSetting;
}

export type FormDataResponse = ExcelFormDataResponse | OnwardFormDataResponse;
