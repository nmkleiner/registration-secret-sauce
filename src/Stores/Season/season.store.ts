import { defineStore } from "pinia";
import { SeasonState } from "./season-state.interface";
import { useCountryStore } from "../Country/country.store";
import FormBuilderApi from "../../API/FormBuilderApi/form-builder.api.ts";
import { SeasonSetting } from "../../Interfaces";

export const useSeasonStore = defineStore("Season", {
  state: (): SeasonState => ({
    // selectedSeason: null,
    availableSeasons: null,
    applicationSeason: null,
  }),
  getters: {},
  actions: {
    async getAvailableSeasons() {
      const { productCountryIsoCode: countryIsoCode } = useCountryStore();
      this.availableSeasons = await FormBuilderApi.getAvailableSeasons(
        countryIsoCode
      );
    },
    setApplicationSeason(applicationSeason: SeasonSetting) {
      this.applicationSeason = applicationSeason;
    },
  },
});
