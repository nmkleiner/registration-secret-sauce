import {
  birthDate,
  country,
  countryOfBirth,
  email,
  firstName,
  gender,
  lastName,
  mailingCountryCode,
  phone,
  secondaryEmail,
} from "../Constants/create-account-inputs.constants.ts";

export enum CreateAccountInputs {
  EMAIL = email,
  COUNTRY = country,
  PHONE_NUMBER = phone,
  BIRTH_DATE = birthDate,
  FIRST_NAME = firstName,
  LAST_NAME = lastName,
  GENDER = gender,
  SECONDARY_EMAIL = secondaryEmail,
  MAILING_COUNTRY_CODE = mailingCountryCode,
  COUNTRY_OF_BIRTH = countryOfBirth,
  PRIVACY_SIGNATURE = "privacy_signature",
  SEASON_ID = "season_id",
  TAGLIT_PROGRAM = "taglit_program",
  TO_PARTNER_RELATION_ID = "to_partner_relation_id",
}
