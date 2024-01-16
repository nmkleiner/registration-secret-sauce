import {
  AgeRange,
  AuthenticateResponse,
  CheckDetailsRequestData,
  CheckDetailsResponse,
  ControlQuestionsResponse,
  CreateAccountRequestData,
  CreateAccountResponse,
  EmailExistResponse,
  LoginResponse,
  SendTempCodeResponse,
} from './auth-api.interfaces';
import router from '../../Router';
import { BaseApi } from '../../../../excel-registration-front/src/Core/Infrastructure/API/base.api';
import { AuthApiRoutes } from './auth-api-routes.enum';
import { ExcelPathNames } from '../../../../excel-registration-front/src/Modules/Excel/Router/path-names.enum';
import { AppHttpClient } from '../../../../excel-registration-front/src/Core/Infrastructure/HttpClient/http-client';
import { useUserStore } from '../../Stores/User/user.store';
import { ControlQuestionReturningApplicant } from '../../../../excel-registration-front/src/Modules/Onward/Interfaces/control-question-returning-applicant';

class AuthApi extends BaseApi {
  public async authenticate(): Promise<AuthenticateResponse['user']> {
    try {
      const response = await this.httpClient.get<AuthenticateResponse>(AuthApiRoutes.auth);
      return response.data.user;
    } catch (e) {
      await router.push({ name: ExcelPathNames.Login });
    }
  }

  public async emailExist(email: string, countryIsoCode: string): Promise<EmailExistResponse> {
    try {
      const response = await this.httpClient.post<EmailExistResponse>(AuthApiRoutes.emailExist, {
        email,
        country: countryIsoCode,
        taglit_program: this.program,
        origin: this.origin,
      });
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async sendTempCode(email: string, countryIsoCode: string): Promise<SendTempCodeResponse> {
    try {
      const response = await this.httpClient.post(AuthApiRoutes.sendTempCode, {
        email,
        country: countryIsoCode,
        taglit_program: this.program,
        origin: this.origin,
      });
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async loginRequest(
    email: string,
    password: string,
    countryIsCode: string,
  ): Promise<LoginResponse> {
    try {
      const response = await this.httpClient.post(AuthApiRoutes.loginRequest, {
        email,
        password,
        country: countryIsCode,
        taglit_program: this.program,
        origin: this.origin,
      });
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async checkDetails(
    checkDetailsRequestData: CheckDetailsRequestData,
  ): Promise<CheckDetailsResponse> {
    try {
      const response = await this.httpClient.post(AuthApiRoutes.checkDetails, {
        ...checkDetailsRequestData,
        taglit_program: this.program,
        country: this.country,
      });
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async createAccount(
    createAccountRequestData: CreateAccountRequestData,
  ): Promise<CreateAccountResponse> {
    try {
      const response = await this.httpClient.post(AuthApiRoutes.createAccount, {
        ...createAccountRequestData,
        taglit_program: this.createAccountProgram,
      });
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async controlQuestionRequest(
    payload: ControlQuestionReturningApplicant,
  ): Promise<ControlQuestionsResponse> {
    const data = {
      application_id: useUserStore().returningApplicantForm.applicationId,
      field_set: payload.fieldSet,
      answer: payload.answer,
    };

    try {
      const response = await this.httpClient.post(AuthApiRoutes.controlQuestion, data);
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  //
  // public async resetVisitorData() {
  //   try {
  //     const response = await this.httpClient.post(AuthApiRoutes.resetVisitorData, {
  //       key: 'returningApplicant',
  //     });
  //     return response?.data;
  //   } catch (e) {
  //     console.error(e);
  //     return null;
  //   }
  // }

  public async getCreateAccountData(): Promise<AgeRange> {
    try {
      const response = await this.httpClient.get(AuthApiRoutes.createAccountData);
      return response?.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new AuthApi(AppHttpClient.instance);
