import { LocationQuery } from 'vue-router';

export interface AuthenticateResponse {
  user: {
    email: string;
    contact_id: string;
    application_id: string;
    submission_date: string;
    country_ISO_code: string; // from website - empty after login - IL0/UK0
    registration_ISO_code: string; // from salesforce - IL/US
    ask_control_question: boolean;
    onward_active_application: string | null;
    onward_active_application_created_date: string;
  };
}

export interface SsoResponse {
  message: string;
  error_id: string;
  error_text: string;
  is_success: boolean;
}

export interface EmailExistResponse extends SsoResponse {
  data: EmailExistResponseData;
}

export interface EmailExistResponseData {
  email: string;
  product: string;
  trip_id: string;
  provider: string;
  last_name: string;
  URL_iframe: string;
  contact_id: string;
  first_name: string;
  partner_id: string;
  email_exist: boolean;
  organizer_id: string;
  application_id: string;
  season_change: boolean;
  submission_date: string;
  application_status: string;
  is_second_reg_phase: boolean;
  ask_control_question: boolean;
  registration_ISO_code: string;
  bri_active_application: string | null;
  is_trip_change_allowed: boolean;
  excel_active_application: string | null;
  onward_active_application: string | null;
  removed_from_mobile_app: boolean;
  mobile_phone: string; //1-546-156-876546
  date_of_birth: string; // 1990-01-01
  lead_type: string;
}

export interface SendTempCodeResponse extends SsoResponse {
  data: unknown;
}

export interface LoginResponse extends SsoResponse {
  data: LoginResponseData;
}

export interface LoginResponseData extends EmailExistResponseData {
  jwt: string;
}

export interface CheckDetailsResponse extends SsoResponse {
  data: CheckDetailsResponseData;
}

export interface CheckDetailsResponseData extends EmailExistResponseData {
  jwt: string;
}

export interface CreateAccountResponse extends SsoResponse {
  data: CreateAccountResponseData;
}

export interface CreateAccountResponseData extends EmailExistResponseData {
  jwt: string;
}

export interface CreateAccountRequestData {
  email: string;
  gender: string;
  country: string;
  last_name: string;
  season_id: string;
  birth_date: string;
  first_name: string;
  phone_number: string;
  taglit_program: string;
  secondary_email: string;
  country_of_birth: string;
  privacy_signature: string;
  urlParams: LocationQuery;
  mailing_country_code: string;
  to_partner_relation_id: string;
}

export interface CheckDetailsRequestData {
  email: string;
  gender: string;
  country: string;
  last_name: string;
  birth_date: string;
  first_name: string;
  phone_number: string;
  taglit_program: string;
  secondary_email: string;
  country_of_birth: string;
  privacy_signature: string;
  mailing_country_code: string;
}

export interface AgeRange {
  min: string;
  max: string;
  criticalAge: string;
}

export interface ControlQuestionsResponse {
  data: object;
  error_id: string;
  error_text: string;
  is_success: boolean;
}
