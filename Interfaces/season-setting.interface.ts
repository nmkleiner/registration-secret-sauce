export interface SeasonSetting {
  id: string;
  seasonCode: number;
  sfSeasonSettingId: string;
  countryIsoCode: string;
  isPaypalAvailable: boolean;
  isPayoneerAvailable: boolean;
  isPreReg: boolean;
  isFullPreReg: boolean;
  isDepositAllowed: boolean;
}

export interface UpdateSeasonSettingPayload {
  contactId: string;
  applicationId: string;
  seasonSettingId: string;
  // added to let us be able to know in the browser network which season was selected
  //seasonId?: string;
  urlParams: Record<string, string>;
  //fromMobileApp: boolean;
  //fullLoginUrl: string;
}