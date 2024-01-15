import { PaymentStatus } from '@paypal/paypal-js';

export interface GetApplicationsResponse {
  data: {
    excel_applications: RawApplication[];
  };
}

export interface RawApplication {
  allow_payment: boolean;
  application_id: string;
  payment_status: PaymentStatus;
  move_to_registration_phase_two: boolean;
  phase_two_complete: boolean;
  phase_2_submission_date: string;
  season_code: number;
  season_name: string;
  season_country_iso_code: string;
  submission_date: string;
  season_id: string;
  season_start: string; // YYYY-MM-DD not used
  season_end: string; // YYYY-MM-DD
}
