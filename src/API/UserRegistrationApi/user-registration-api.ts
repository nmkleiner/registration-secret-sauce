import { SaveSectionResponse } from "./Interfaces/save-section.response.ts";
import { BaseApi } from "../BaseApi/base.api.ts";
import {
  GetApplicationsResponse,
  RawApplication,
} from "./Interfaces/get-applications.response.ts";
import { UserRegistrationRoutes } from "./user-registration-routes.enum.ts";
import { SubmitSectionDto } from "./Interfaces/submit-section.dto.ts";
import { CreateNewExcelApplicationDto } from "./Interfaces/create-new-application.dto.ts";
import { UpdateOnwardApplicantDto } from "./Interfaces/update-onward-applicant.dto.ts";
import { AppHttpClient } from "../HttpClient/http-client.ts";

class UserRegistrationApi extends BaseApi {
  public async getApplications(contactId: string): Promise<RawApplication[]> {
    const response = await this.httpClient.get<GetApplicationsResponse>(
      UserRegistrationRoutes.getApplications,
      {
        params: { contactId },
      }
    );

    return response.data.data.excel_applications;
  }

  public async submitSection(
    submitSectionDto: SubmitSectionDto
  ): Promise<SaveSectionResponse | { success: false }> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.submitSection,
      {
        ...submitSectionDto,
        product: this.product,
      }
    );

    return response ? response.data : { success: false };
  }

  public async createNewExcelApplication(
    submitSectionDto: CreateNewExcelApplicationDto
  ): Promise<SaveSectionResponse> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.createNewExcelApplication,
      {
        ...submitSectionDto,
      }
    );

    return response.data;
  }

  public async setOnwardProgram(dto: UpdateOnwardApplicantDto) {
    return this.httpClient.post(UserRegistrationRoutes.setOnwardProgram, dto);
  }

  public async submitIneligibleApplication() {
    return this.httpClient.post(
      UserRegistrationRoutes.submitIneligibleApplication
    );
  }
}

export default new UserRegistrationApi(AppHttpClient.instance);
