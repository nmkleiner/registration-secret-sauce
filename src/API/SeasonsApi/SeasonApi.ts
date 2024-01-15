import { BaseApi } from "../BaseApi/base.api.ts";
import { AppHttpClient } from "../HttpClient/http-client.ts";
import { UpdateSeasonSettingPayload } from "../../Interfaces";
import { SaveSectionResponse } from "../UserRegistrationApi/Interfaces/save-section.response.ts";
import { UserRegistrationRoutes } from "../UserRegistrationApi/user-registration-routes.enum.ts";

class SeasonApi extends BaseApi {
  public async updateApplicationSeasonSetting(
    payload: UpdateSeasonSettingPayload
  ): Promise<any | { success: false }> {
    const response = await this.httpClient.post<SaveSectionResponse>(
      UserRegistrationRoutes.updateSeasonSetting,
      {
        ...payload,
        product: this.product,
      }
    );

    return response ? response.data : { success: false };
  }
}
export default new SeasonApi(AppHttpClient.instance);
