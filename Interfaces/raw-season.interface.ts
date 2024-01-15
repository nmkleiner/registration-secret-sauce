export interface RawSeason {
  id: number;
  endDate: string;
  isDepositAllowed: boolean;
  isFullPreReg: boolean;
  isPreReg: boolean;
  marketDefaultSeasonCode: number;
  name: string;
  countryName: string;
  startDate: string;
  status: string;
  value: string; // SF ID
}
