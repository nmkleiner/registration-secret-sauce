import { UpdateSeasonSettingPayload } from '../../Interfaces/season-setting.interface';
import { UserRegistrationRoutes } from '../UserRegistrationApi/user-registration-routes.enum';
import { BaseApi } from '../../../../excel-registration-front/src/Core/Infrastructure/API/base.api';
import { SaveSectionResponse } from '../UserRegistrationApi/Interfaces/save-section.response';
import { AppHttpClient } from '../../../../excel-registration-front/src/Core/Infrastructure/HttpClient/http-client';

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
