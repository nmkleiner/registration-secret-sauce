import { FormDataResponse } from "../Interfaces/get-form-data-base.interface.ts";
import { OnwardFormDataResponse } from "../Interfaces/onward-get-form-data-response.interface.ts";
import { ExcelFormDataResponse } from "../Interfaces/excel-get-form-data-response.interface.ts";
import {
  ExcelSaveSectionResponse,
  OnwardSaveSectionResponse,
  SaveSectionResponse,
} from "../../UserRegistrationApi/Interfaces/save-section.response.ts";

export function isOnwardGetResponse(
  response: FormDataResponse
): response is OnwardFormDataResponse {
  return response.type === "ONWARD";
}

export function isExcelGetResponse(
  response: FormDataResponse
): response is ExcelFormDataResponse {
  return response.type === "EXCEL";
}

export function isExcelPushResponse(
  response: SaveSectionResponse
): response is ExcelSaveSectionResponse {
  return response.type === "EXCEL";
}

export function isOnwardPushResponse(
  response: SaveSectionResponse
): response is OnwardSaveSectionResponse {
  return response.type === "ONWARD";
}
