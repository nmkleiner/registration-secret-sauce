import { SeasonSetting } from '../../Interfaces/season-setting.interface';
import { RawSeason } from '../../Interfaces/raw-season.interface';

export interface SeasonState {
  applicationSeason: SeasonSetting;
  // selectedSeason: RawSeasonOption;
  availableSeasons: RawSeason[];
}
