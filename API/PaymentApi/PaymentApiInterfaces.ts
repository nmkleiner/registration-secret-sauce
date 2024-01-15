export interface CreatePaymentDto {
  countryIsoCode: string;
  contactId: string;
  applicationId: string;
}

export interface ProcessPaymentDto {
  orderID: string;
  contactId: string;
  applicationId: string;
  paypalErrorCode?: string;
}

export interface CreatePaymentResponse {
  data: {
    orderID: string;
    success: boolean;
  };
}

export interface ProcessPaymentResponse {
  data: CapturePaymentResponseData;
}

export interface CapturePaymentResponseData {
  transactionTime?: string;
  success?: boolean;

  name?: string;
  details?: PaypalErrorDetails[];
}

export interface PaypalErrorDetails {
  description: string;
  issue: string;
}
