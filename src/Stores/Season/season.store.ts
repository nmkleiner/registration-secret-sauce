import { defineStore } from 'pinia';
import { SeasonState } from './season-state.interface';
import { SeasonSetting } from '../../Interfaces/season-setting.interface';
import { FormBuilderApi } from '../../API';
import { useCountryStore } from '../Country/country.store';

export const useSeasonStore = defineStore('Season', {
  state: (): SeasonState => ({
    // selectedSeason: null,
    availableSeasons: null,
    applicationSeason: null,
  }),
  getters: {},
  actions: {
    async getAvailableSeasons() {
      const { productCountryIsoCode: countryIsoCode } = useCountryStore();
      this.availableSeasons = await FormBuilderApi.getAvailableSeasons(countryIsoCode);
    },
    setApplicationSeason(applicationSeason: SeasonSetting) {
      this.applicationSeason = applicationSeason;
    },
  },
});
