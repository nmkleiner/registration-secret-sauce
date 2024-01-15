import { RawForm } from '../../../../../../../registration-secret-sauce/Interfaces';
import { RegistrationStage } from '../../../../../../../registration-secret-sauce/Interfaces';
import { SeasonSetting } from '../../../../../../../registration-secret-sauce/Interfaces';
import { RawSeason } from '../../../../../../../registration-secret-sauce/Interfaces';
import { ContactData } from '../../../../../../../registration-secret-sauce/Interfaces';
import { ApplicationData } from '@/Modules/Problems/Interfaces/application-data.interfaces';
import { DropdownsFromDB } from '../../../../../../../registration-secret-sauce/Interfaces';
import { OnwardFormDataResponse } from '@/Modules/Common/API/FormBuilderApi/Interfaces/onward-get-form-data-response.interface';
import { ExcelFormDataResponse } from '@/Modules/Common/API/FormBuilderApi/Interfaces/excel-get-form-data-response.interface';

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
