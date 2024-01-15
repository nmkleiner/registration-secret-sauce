import { UpdateSeasonSettingPayload } from '../../../../../../registration-secret-sauce/Interfaces';
import { UserRegistrationRoutes } from '@/Modules/Common/API/UserRegistrationApi/user-registration-routes.enum';
import { BaseApi } from '@/Core/Infrastructure/API/base.api';
import { SaveSectionResponse } from '@/Modules/Common/API/UserRegistrationApi/Interfaces/save-section.response';
import { AppHttpClient } from '@/Core/Infrastructure/HttpClient/http-client';

class SeasonApi extends BaseApi {
  public async updateApplicationSeasonSetting(
    payload: UpdateSeasonSettingPayload,
  ): Promise<any | { success: false }> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.updateSeasonSetting,
      {
        ...payload,
        product: this.product,
      },
    );

    return response ? response.data : { success: false };
  }
}
export default new SeasonApi(AppHttpClient.instance);
