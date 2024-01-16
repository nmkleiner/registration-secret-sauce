import { RawSeason, SeasonSetting } from "../../Interfaces";

export interface SeasonState {
  applicationSeason: SeasonSetting;
  // selectedSeason: RawSeasonOption;
  availableSeasons: RawSeason[];
}
