import { PaymentStatus } from "../../Interfaces";

export interface PaymentState {
  allowPayment: boolean;
  date: string;
  status: PaymentStatus;
}
