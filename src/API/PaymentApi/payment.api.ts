import { AxiosResponse } from 'axios';
import { PaymentApiEndpoints } from './payment-api-routes.enum';
import { BaseApi } from '../../../../excel-registration-front/src/Core/Infrastructure/API/base.api';
import { AppHttpClient } from '../../../../excel-registration-front/src/Core/Infrastructure/HttpClient/http-client';
import {
  CapturePaymentResponseData,
  CreatePaymentDto,
  CreatePaymentResponse,
  ProcessPaymentDto,
  ProcessPaymentResponse,
} from './PaymentApiInterfaces';

class PaymentApi extends BaseApi {
  public async createOrder(createPaymentDto: CreatePaymentDto): Promise<string> {
    try {
      const createPaymentResponse: AxiosResponse<CreatePaymentResponse> =
        await this.httpClient.post(PaymentApiEndpoints.createPaypalOrder, createPaymentDto);
      if (!createPaymentResponse.data.data.success) {
        console.log('payment forbidden');
        // await dispatch(Modules.MODALS, 'activateModal', ModalNames.paymentForbidden);
        return;
      }

      return createPaymentResponse.data.data.orderID;
    } catch (e) {
      return null;
    }
  }

  public async capturePayment(
    paymentDataDto: ProcessPaymentDto,
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
