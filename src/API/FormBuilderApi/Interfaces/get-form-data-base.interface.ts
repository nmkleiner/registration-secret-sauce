import { ExcelFormDataResponse } from "./excel-get-form-data-response.interface.ts";
import { OnwardFormDataResponse } from "./onward-get-form-data-response.interface.ts";
import {
  ApplicationData,
  ContactData,
  DropdownsFromDB,
  RawForm,
  RawSeason,
  RegistrationStage,
  SeasonSetting,
} from "../../../Interfaces";

export interface BaseFormDataResponse {
  type: "EXCEL" | "ONWARD";
  form: RawForm;
  registrationStages: RegistrationStage[];
  contactData: ContactData;
  applicationData: ApplicationData["EXCEL" | "ONWARD"];
  dropdownsFromDB: DropdownsFromDB["EXCEL" | "ONWARD"];

  availableSeasons: RawSeason[];
  applicationSeasonSetting: SeasonSetting;
  formSeasonSetting: SeasonSetting;
}

export type FormDataResponse = ExcelFormDataResponse | OnwardFormDataResponse;
