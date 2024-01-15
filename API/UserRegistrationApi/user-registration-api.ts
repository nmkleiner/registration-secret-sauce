import { BaseApi } from '@/Core/Infrastructure/API/base.api';
import { AppHttpClient } from '@/Core/Infrastructure/HttpClient/http-client';
import { UserRegistrationRoutes } from '@/Modules/Common/API/UserRegistrationApi/user-registration-routes.enum';
import { SubmitSectionDto } from '@/Modules/Common/API/UserRegistrationApi/Interfaces/submit-section.dto';
import {
  GetApplicationsResponse,
  RawApplication,
} from '@/Modules/Common/API/UserRegistrationApi/Interfaces/get-applications.response';
import { SaveSectionResponse } from '@/Modules/Common/API/UserRegistrationApi/Interfaces/save-section.response';
import { CreateNewExcelApplicationDto } from '@/Modules/Common/API/UserRegistrationApi/Interfaces/create-new-application.dto';
import { UpdateOnwardApplicantDto } from '@/Modules/Common/API/UserRegistrationApi/Interfaces/update-onward-applicant.dto';

class UserRegistrationApi extends BaseApi {
  public async getApplications(contactId: string): Promise<RawApplication[]> {
    const response = await this.httpClient.get<GetApplicationsResponse>(
      UserRegistrationRoutes.getApplications,
      {
        params: { contactId },
      },
    );

    return response.data.data.excel_applications;
  }

  public async submitSection(
    submitSectionDto: SubmitSectionDto,
  ): Promise<SaveSectionResponse | { success: false }> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.submitSection,
      {
        ...submitSectionDto,
        product: this.product,
      },
    );

    return response ? response.data : { success: false };
  }

  public async createNewExcelApplication(
    submitSectionDto: CreateNewExcelApplicationDto,
  ): Promise<SaveSectionResponse> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.createNewExcelApplication,
      {
        ...submitSectionDto,
      },
    );

    return response.data;
  }

  public async setOnwardProgram(dto: UpdateOnwardApplicantDto) {
    return this.httpClient.post(UserRegistrationRoutes.setOnwardProgram, dto);
  }

  public async submitIneligibleApplication() {
    return this.httpClient.post(UserRegistrationRoutes.submitIneligibleApplication);
  }
}

export default new UserRegistrationApi(AppHttpClient.instance);
