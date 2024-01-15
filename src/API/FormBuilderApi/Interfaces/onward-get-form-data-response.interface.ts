import { BaseFormDataResponse } from "./get-form-data-base.interface.ts";
import {
  ApplicationData,
  ContactData,
  DropdownsFromDB,
} from "../../../Interfaces";

export interface OnwardFormDataResponse extends BaseFormDataResponse {
  type: "ONWARD";
  settings: Record<string, string>;
  contactData: ContactData;
  applicationData: ApplicationData["ONWARD"];
  dropdownsFromDB: DropdownsFromDB["ONWARD"];
  isControlQuestionsPopUpActive: boolean;
}
