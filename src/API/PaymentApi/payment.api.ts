import { AxiosResponse } from "axios";
import { BaseApi } from "../BaseApi/base.api.ts";
import { AppHttpClient } from "../HttpClient/http-client.ts";
import { PaymentApiEndpoints } from "./payment-api-routes.enum.ts";
import {
  CapturePaymentResponseData,
  CreatePaymentDto,
  CreatePaymentResponse,
  ProcessPaymentDto,
  ProcessPaymentResponse,
} from "./PaymentApiInterfaces.ts";

class PaymentApi extends BaseApi {
  public async createOrder(
    createPaymentDto: CreatePaymentDto
  ): Promise<string> {
    try {
      const createPaymentResponse: AxiosResponse<CreatePaymentResponse> =
        await this.httpClient.post(
          PaymentApiEndpoints.createPaypalOrder,
          createPaymentDto
        );
      if (!createPaymentResponse.data.data.success) {
        console.log("payment forbidden");
        // await dispatch(Modules.MODALS, 'activateModal', ModalNames.paymentForbidden);
        return;
      }

      return createPaymentResponse.data.data.orderID;
    } catch (e) {
      return null;
    }
  }

  public async capturePayment(
    paymentDataDto: ProcessPaymentDto
  ): Promise<CapturePaymentResponseData | null> {
    try {
      const processPaymentResponse: AxiosResponse<ProcessPaymentResponse> =
        await this.httpClient.post(PaymentApiEndpoints.capturePaypalPayment, {
          ...paymentDataDto,
          product: this.product,
        });

      return processPaymentResponse.data.data;
    } catch (e) {
      return null;
    }
  }
}

export default new PaymentApi(AppHttpClient.instance);
