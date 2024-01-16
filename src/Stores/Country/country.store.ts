import { defineStore } from "pinia";
import { CountryState } from "./country-state.interface";
import { TaglitProduct } from "../../Enums";
import { OnwardCountries } from "../../Enums/onward-countries.enum.ts";
import CountryApi from "../../API/CountryApi/country.api.ts";
import {
  AuthenticateResponse,
  GetCountryResponse,
  GetTranslationsResponse,
} from "../../API";
import { useConfig } from "../../Config/use-config.ts";

export const useCountryStore = defineStore("Country", {
  state: (): CountryState => ({
    name: "",
    areaCode: "",
    resourceId: "",
    // excelIsoCode: ExcelCountries.Empty,
    depositAmount: null,
    dateFormat: "MMMM DD, YYYY",
    payPalCurrency: "",
    privacyPolicyTranslation: "",
    returningApplicantTranslation: null,
  }),
  getters: {
    productCountryIsoCode(): string {
      const product = useConfig().getProduct();

      switch (product) {
        // case TaglitProduct.EXCEL:
        //   return this.excelIsoCode;
        case TaglitProduct.ONWARD:
          return OnwardCountries.Onward;
      }
    },
  },
  actions: {
    initCountry(user: AuthenticateResponse["user"]) {
      const countryIsoCode =
        user.country_ISO_code || user.registration_ISO_code;
      this.setExcelCode(countryIsoCode);
    },
    async getCountry() {
      const countrySettings = await CountryApi.getCountry(
        this.productCountryIsoCode
      );
      this.setCountrySettings(countrySettings);
    },
    async getTranslations(): Promise<GetTranslationsResponse["translations"]> {
      // const countryIsoCode = useProduct().isExcel.value
      //   ? ExcelCountries.UK0
      //   : OnwardCountries.Onward;
      const response = await CountryApi.getTranslations(OnwardCountries.Onward);
      this.privacyPolicyTranslation = response.privacyPolicyTranslation;
      if (useConfig().getProduct() === "ONWARD") {
        this.returningApplicantTranslation =
          response.returningApplicantTranslation;
      }
      return response.translations;
    },
    setCountrySettings(countrySettings: GetCountryResponse) {
      this.name = countrySettings.name;
      this.areaCode = countrySettings.areaCode;
      this.resourceId = countrySettings.resourceId;
      this.depositAmount = countrySettings.depositAmount;
      this.payPalCurrency = countrySettings.payPalCurrency || "USD";
    },
    // setExcelCode(countryIsoCode: string) {
    //   this.excelIsoCode = countryIsoCode.toUpperCase().includes('IL')
    //     ? ExcelCountries.Israel
    //     : ExcelCountries.UK0;
    // },
    setDateFormat(dateFormat: string) {
      this.dateFormat = dateFormat;
    },
  },
});
