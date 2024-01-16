import { PaymentStatus } from '../../Interfaces/application-data.interfaces';

export interface PaymentState {
  allowPayment: boolean;
  date: string;
  status: PaymentStatus;
}
