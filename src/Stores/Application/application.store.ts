import { defineStore } from "pinia";
import { useUserStore } from "../User/user.store";
import { useCountryStore } from "../Country/country.store";
import { useFormNavigationStore } from "../FormNavigation/form-navigation.store";
import { ApplicationState } from "./registration-form-state.interface";
import { useDropdownOptionsStore } from "../DropdownOptions/dropdown-options.store";
// import { useInternshipPreferencesStore } from '@/Modules/Excel/Stores/InternshipPreferences/internship-preferences.store';
// import { useRouter } from 'vue-router';
import { useSeasonStore } from "../Season/season.store";
import { usePaymentStore } from "../Payment/payment.store";
// import { ExcelPathNames } from '@/Modules/Excel/Router/path-names.enum';
import { useStorage } from "@vueuse/core";
import { first } from "lodash-es";
import SeasonApi from "../../API/SeasonsApi/SeasonApi.ts";
import { RawForm, RawSeason } from "../../Interfaces";
import { FormDataResponse, GetFormDataPayload } from "../../API";
import { buildUrlParams } from "../../Composables";
import FormBuilderApi from "../../API/FormBuilderApi/form-builder.api.ts";
import { useModalsStore } from "../Modals/modals.store.ts";
import { ModalNames } from "../Modals/modals-state.interface.ts";
// import AppConfig from '@/Core/Infrastructure/Config/AppConfig';

export const useApplicationStore = defineStore("Application", {
  state: (): ApplicationState => ({
    formId: "",
    formName: "",
    resourceId: null,
    maxFileSize: 10, // MB
    applicationId: useStorage("applicationId", ""),
    activePhase: 1,
    throwError: false,
    formElementsManager: new FormElementsManager(),
    parentSectionManager: new ParentSectionManager(),
    isPhase2Application: false,
    activationStatus: "",
    hasApplicationBeenSubmitted: false,
    isPhase2Submission: false,
    phase1: {
      allowSubmission: false,
      completed: false,
    },
    phase2: {
      allowSubmission: false,
      completed: false,
    },
    hasIneligibleError: false,
    currentApplicationId: null,
    dataForAlgorithmPrograms: null,
    isAllowChangeOnwardTrip: false,
  }),
  getters: {
    isViewOnlyApplication(): boolean {
      return (
        (this.activePhase === 1 && this.hasApplicationBeenSubmitted) ||
        (this.activePhase === 2 && this.phase2.completed) ||
        (this.activationStatus && this.activationStatus !== "Active")
      );
    },
  },
  actions: {
    // beforeGetFormDataExcel(): boolean {
    //   if (!useProduct().isExcel.value) {
    //     return true;
    //   }
    //   useFormNavigationStore().resetNavigation();
    //   const { phase } = useRouter().currentRoute.value.params;
    //   if (!this.applicationId) {
    //     console.error('Route error: application id is missing');
    //     useRouter().push({ name: ExcelPathNames.Profile });
    //     return false;
    //   }
    //   if (!phase) {
    //     console.error('Route error: phase is missing');
    //     useRouter().push({ name: ExcelPathNames.Profile });
    //     return false;
    //   }
    //
    //   this.activePhase = Number(phase);
    //   return true;
    // },
    // afterGetFormDataExcel(formData: FormDataResponse) {
    //   if (!isExcelGetResponse(formData)) {
    //     return;
    //   }
    //   if (this.activePhase === 2 && !this.isPhase2Application) {
    //     if (AppConfig.environment === 'production') {
    //       router.push({ name: ExcelPathNames.Profile });
    //     }
    //   }
    //   this.setApplicationStateExcel(formData.applicationData);
    //   useUserStore().setIsraelPassport(formData.israelPassport);
    //   useInternshipPreferencesStore().initInternshipPreferences(
    //     formData.selectedJobOfferings,
    //     formData.industries,
    //   );
    //   this.setMaxFileSize(formData.settings.maxFileSize);
    // },
    beforeGetFormDataOnward() {
      this.applicationId = useUserStore().ids.activeApplicationId;
    },
    afterGetFormDataOnward(formData: FormDataResponse) {
      if (!isOnwardGetResponse(formData)) {
        return;
      }

      this.setApplicationAndUserStateOnward(
        formData.applicationData,
        formData.contactData
      );
    },
    afterInitializeFormOnward() {
      if (!useConfig().getProduct() === "ONWARD") return;
      this.parentSectionManager.filterEmergencyContactOptions();
    },
    async getFormData() {
      useModalsStore().openModal(ModalNames.pleaseWait);
      // const isContinue = this.beforeGetFormDataExcel();
      this.beforeGetFormDataOnward();
      const contactId = useUserStore().ids.contactId;
      const applicationId = this.currentApplicationId
        ? this.currentApplicationId
        : this.applicationId;
      const countryIsoCode = useCountryStore().productCountryIsoCode;

      useModalsStore().closeModal(ModalNames.pleaseWait);
      // if (!isContinue) {
      //   return;
      // }
      // pull the data
      const phase = router.currentRoute.value.params.phase as string;
      const getFormDataPayload = {
        phase,
        contactId,
        applicationId,
        countryIsoCode,
      };
      let formDataResponse = await FormBuilderApi.getFormData(
        getFormDataPayload
      );

      useSeasonStore().setApplicationSeason(
        formDataResponse.applicationSeasonSetting
      );

      if (useConfig().getProduct() === "ONWARD") {
        const response = formDataResponse as OnwardFormDataResponse;
        if (
          response.applicationData.askControlQuestions &&
          response.isControlQuestionsPopUpActive
        ) {
          await useUserStore().returningApplicantForm.goToLoginIfReturningApplicant();
          useModalsStore().closeModal(ModalNames.pleaseWait);
          return;
        }
      }

      // update season setting
      if (
        !formDataResponse.form &&
        (formDataResponse.applicationData as ApplicationData["ONWARD"])
          ?.isAllowChangeOnwardTrip
      ) {
        formDataResponse = await this.handleOldSeasonApplication(
          formDataResponse,
          getFormDataPayload
        );
      }

      this.setFormDetails(formDataResponse.form);

      useUserStore().setContactId(formDataResponse.contactData.id);
      useUserStore().setContactInformation(formDataResponse.contactData);

      useUserStore().setContactDocuments(
        formDataResponse.contactData.documents
      );
      useUserStore().setPhase2Documents(
        formDataResponse.contactData.phase2Documents
      );
      // this.afterGetFormDataExcel(formDataResponse);
      this.afterGetFormDataOnward(formDataResponse);

      useDropdownOptionsStore().setDbOptions(formDataResponse);

      usePaymentStore().setPaymentState(
        formDataResponse.applicationData.payment
      );

      // create the tabs,sections,questions
      useFormNavigationStore().initNavigation(
        formDataResponse.registrationStages,
        formDataResponse.form.sections
      );

      this.formElementsManager.initializeOptionConditions();
      this.afterInitializeFormOnward();

      useModalsStore().closeModal(ModalNames.pleaseWait);

      return true;
    },
    async handleOldSeasonApplication(
      formData: FormDataResponse,
      payload: GetFormDataPayload
    ): Promise<FormDataResponse> {
      const { availableSeasons } = formData;
      const seasonSettingId = first<RawSeason>(availableSeasons).value;

      const updateSeason = await SeasonApi.updateApplicationSeasonSetting({
        ...payload,
        seasonSettingId,
        urlParams: buildUrlParams(),
      });
      if (updateSeason) {
        return FormBuilderApi.getFormData(payload);
      }
    },
    setFormDetails(form: RawForm) {
      this.formId = form.id;
      this.formName = form.name;
      this.resourceId = form.resourceId;
    },
    setApplicationId(id: string) {
      this.applicationId = id;
    },
    setApplicationStateExcel(applicationData: ApplicationData["EXCEL"]) {
      this.phase1.allowSubmission = applicationData.phase1AllowSubmission;
      this.phase2.allowSubmission = applicationData.phase2AllowSubmission;
      this.phase1.completed = applicationData.isMainPhaseComplete;
      this.phase2.completed = applicationData.isPhase2Completed;
      this.isPhase2Application = applicationData.isPhase2Application;
      this.activationStatus = applicationData.activationStatus;
      this.hasApplicationBeenSubmitted =
        applicationData.hasApplicationBeenSubmitted;
    },
    setApplicationAndUserStateOnward(
      applicationData: ApplicationData["ONWARD"],
      contactData: ContactData
    ) {
      this.phase1.allowSubmission = applicationData.phase1AllowSubmission;
      this.isPhase2Application = applicationData.isPhase2Application;
      this.isAllowChangeOnwardTrip = applicationData.isAllowChangeOnwardTrip;
      this.updateApplicationPrograms(applicationData.applicationTripOfferings);

      this.setIneligibleError(
        applicationData.finalEligibility === OnwardErrorMessageEnum.Ineligible
      );

      useUserStore().setContactHasLivingParent(applicationData.hasLivingParent);

      useApplicationStore().updateDataForAlgorithmPrograms({
        ...applicationData.dataForAlgorithmPrograms,
        gender: contactData.gender,
      });
    },
    toggleThrowError() {
      this.throwError = !this.throwError;
    },
    setMaxFileSize(maxFileSize: number) {
      this.maxFileSize = maxFileSize / (1024 * 1024);
    },
    setIsPhase2Submission(isPhase2Submission: boolean) {
      this.isPhase2Submission = isPhase2Submission;
    },
    updateApplicationAfterSave(payload: {
      phase1AllowSubmission: boolean;
      phase2AllowSubmission: boolean;
    }) {
      this.phase1.allowSubmission = payload.phase1AllowSubmission;
      this.phase2.allowSubmission = payload.phase2AllowSubmission;
    },
    async createNewExcelApplication() {
      useModalsStore().openModal(ModalNames.pleaseWait);
      const contactId = useUserStore().ids.contactId;
      const availableSeasons = useSeasonStore().availableSeasons;
      const seasonSettingId = first<RawSeason>(availableSeasons).value;
      const { firstName, lastName, email, mobilePhone, dateOfBirth } =
        useUserStore().contactInformation;

      const response = await UserRegistrationApi.createNewExcelApplication({
        contactId,
        firstName,
        lastName,
        email,
        mobilePhone,
        dateOfBirth,
        seasonSettingId,
      });
      useModalsStore().closeModal(ModalNames.pleaseWait);

      if (response) {
        const applicationId = response.application.Id;
        this.setApplicationId(applicationId);
        useUserStore().setApplicationId(applicationId);
        await router.push({
          name: "Application",
          params: {
            applicationId: applicationId,
            phase: "1",
          },
        });
      }
    },
    setIneligibleError(flag: boolean): void {
      this.hasIneligibleError = flag;
    },
    setCurrentApplicationId(currentApplicationId: string): void {
      this.currentApplicationId = currentApplicationId;
    },
    updateDataForAlgorithmPrograms(
      dataForAlgorithmPrograms: DataForAlgorithmPrograms
    ): void {
      this.dataForAlgorithmPrograms = { ...dataForAlgorithmPrograms };
    },
    updateApplicationPrograms(applicationPrograms: OnwardApplicationPrograms) {
      if (applicationPrograms?.onwardPrograms?.length) {
        useProgramStore().setApplicationPrograms(
          applicationPrograms.onwardPrograms
        );
      }
      if (applicationPrograms?.notRelevantOnwardPrograms?.length) {
        useProgramStore().setNotRelevantApplicationPrograms(
          applicationPrograms.notRelevantOnwardPrograms
        );
      }
    },
    cleanState() {
      this.formElementsManager = new FormElementsManager();
      this.parentSectionManager = new ParentSectionManager();
    },
  },
});
