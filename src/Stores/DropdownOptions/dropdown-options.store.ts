import { defineStore } from "pinia";
import { DropdownOptionsState } from "./dropdown-options-state.interface";
import FormBuilderApi from "../../API/FormBuilderApi/form-builder.api.ts";

export const useDropdownOptionsStore = defineStore("DropdownOptions", {
  state: (): DropdownOptionsState => ({
    dbOptions: {
      states: [],
      countries: [],
      universities: [],
      studyAreas: [],
      medicalDiagnoses: [],
    },
  }),
  getters: {},
  actions: {
    async fetchCountries() {
      if (this.dbOptions.countries.length) {
        return;
      }

      const options = await FormBuilderApi.getCountryOptions();

      this.setCountries(options);
    },
    setCountries(options: RawCountryOption[]) {
      this.dbOptions.countries = OptionTransformer.transformCountryOptions(
        options?.filter((countryOption) => countryOption.areaCode)
      );
    },
    setDbOptions(response: FormDataResponse) {
      const options = response.dropdownsFromDB;
      this.dbOptions.states = OptionTransformer.transformStateOptions(
        options.states
      );
      this.dbOptions.countries = OptionTransformer.transformCountryOptions(
        options?.countries?.filter((country) => country.areaCode)
      );
      this.dbOptions.universities =
        OptionTransformer.transformUniversityOptions(options.universities);

      if (isOnwardGetResponse(response)) {
        const options = response.dropdownsFromDB;
        this.dbOptions.studyAreas =
          OptionTransformer.transformDropdownFromDBOptions(options.studyAreas);

        this.dbOptions.medicalDiagnoses =
          OptionTransformer.transformCheckboxOptions(
            options.medicalDiagnoses.map((option, index) => ({
              name: option.name,
              mapping: {
                answerName: option.value,
              },
              sort: option.sort,
              id: `medical-diagnosis-${index}`,
            })),
            "medical diagnosis"
          );
      }
    },
  },
});
