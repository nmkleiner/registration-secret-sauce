import dayjs from "dayjs";
import { isEmpty } from "lodash-es";
import { defineStore } from "pinia";
import { ProgramState } from "./program-state.interface";
import UserRegistrationApi from "registration-secret-sauce";
import FormBuilderApi, {
  ModalNames,
  Program,
  UpdateOnwardApplicantDto,
  useModalsStore,
} from "registration-secret-sauce";
import {
  getProgramPriority,
  getProgramsDates,
  getProgramsDurations,
  getProgramsFees,
  getProgramsLocations,
  getSelectedProgramsData,
} from "./helpers";
import { useUserStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/User/user.store";
import { useFormNavigationStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/FormNavigation/form-navigation.store";
import { useApplicationStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Application/application.store";
import { PeerFromUniversity } from "../../../../excel-registration-front/src/Modules/Onward/Constants/peer-from-university.constant";
import { useSeasonStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Season/season.store";
import { useStorage } from "@vueuse/core";
import { compareAsStrings } from "../../../../excel-registration-front/src/Core/Helpers/compare-as-strings";
import { OnwardTypeProgramEnum } from "../../../../excel-registration-front/src/Modules/Onward/Enums/onward-type-program.enum";

export const useProgramStore = defineStore("Program", {
  state: (): ProgramState => ({
    // All the available programs
    programs: [],
    programsPulled: false,
    // Selected programs (before save)
    fellowshipSelectedPrograms: [],
    remoteWorkSelectedPrograms: [],
    volunteeringSelectedPrograms: [],
    isProgramSaved: false,
    applicationPrograms: null,
    notRelevantApplicationPrograms: null,
    urlParams: {
      program: useStorage("programUrlParam", ""),
      organizerId: useStorage("organizerUrlParam", ""),
      partnerId: useStorage("partnerUrlParam", ""),
    },
    selectedProgramFromUrlParam: false,
  }),
  getters: {
    fellowshipOfferedPrograms(): Program[] {
      const selectedProgramIds = this.fellowshipSelectedPrograms.map(
        (program) => program.programId
      );
      return this.programs.filter(
        (program) =>
          program.programId === OnwardTypeProgramEnum.FELLOWSHIP &&
          !selectedProgramIds.includes(program.programId)
      );
    },
    remoteWorkOfferedPrograms(): Program[] {
      const selectedProgramIds = this.remoteWorkSelectedPrograms.map(
        (program) => program.programId
      );
      return this.programs.filter(
        (program) =>
          program.programId === OnwardTypeProgramEnum.REMOTE_WORK &&
          !selectedProgramIds.includes(program.programId)
      );
    },
    volunteeringOfferedPrograms(): Program[] {
      const selectedProgramIds = this.volunteeringSelectedPrograms.map(
        (program) => program.programId
      );
      return this.programs.filter(
        (program) =>
          program.programId === OnwardTypeProgramEnum.VOLUNTEERING &&
          !selectedProgramIds.includes(program.programId)
      );
    },
    getFellowshipPrograms(): Program[] {
      return this.programs.filter(
        (program: Program) =>
          program.programId === OnwardTypeProgramEnum.FELLOWSHIP
      );
    },
    getRemoteWorkPrograms(): Program[] {
      return this.programs.filter(
        (program: Program) =>
          program.programId === OnwardTypeProgramEnum.REMOTE_WORK
      );
    },
    getVolunteeringPrograms(): Program[] {
      return this.programs.filter(
        (program: Program) =>
          program.programId === OnwardTypeProgramEnum.VOLUNTEERING
      );
    },
    getFellowshipProgramsDates(): string {
      return getProgramsDates(this.getFellowshipPrograms);
    },
    getRemoteWorkProgramsDates(): string {
      return getProgramsDates(this.getRemoteWorkPrograms);
    },
    getVolunteeringProgramsDates(): string {
      return getProgramsDates(this.getVolunteeringPrograms);
    },
    getFellowshipProgramsDurations(): string {
      return getProgramsDurations(this.getFellowshipPrograms);
    },
    getRemoteWorkProgramsDurations(): string {
      return getProgramsDurations(this.getRemoteWorkPrograms);
    },
    getVolunteeringProgramsDurations(): string {
      return getProgramsDurations(this.getVolunteeringPrograms);
    },
    getFellowshipProgramsLocations(): string {
      return getProgramsLocations(this.getFellowshipPrograms);
    },
    getRemoteWorkProgramsLocations(): string {
      return getProgramsLocations(this.getRemoteWorkPrograms);
    },
    getVolunteeringProgramsLocations(): string {
      return getProgramsLocations(this.getVolunteeringPrograms);
    },
    getFellowshipProgramsFees(): string {
      return getProgramsFees(this.getFellowshipPrograms);
    },
    getRemoteWorkProgramsFees(): string {
      return getProgramsFees(this.getRemoteWorkPrograms);
    },
    getVolunteeringProgramsFees(): string {
      return getProgramsFees(this.getVolunteeringPrograms);
    },
    getPrimaryApplicationProgram(): Program {
      return this.applicationPrograms?.find((program) => program.isPrimary);
    },
    getSecondaryApplicationPrograms(): Program[] {
      return this.applicationPrograms?.filter((program) => !program.isPrimary);
    },
    isNotRelevantProgramAndNotAllowedChangeOnwardTrip(): boolean {
      return (
        !useApplicationStore().isAllowChangeOnwardTrip &&
        !!this.notRelevantApplicationPrograms?.length &&
        !this.applicationPrograms?.length
      );
    },
    noOffersError(): boolean {
      return (
        (this.programsPulled &&
          isEmpty(this.fellowshipOfferedPrograms) &&
          isEmpty(this.remoteWorkOfferedPrograms) &&
          isEmpty(this.volunteeringOfferedPrograms) &&
          isEmpty(this.fellowshipSelectedPrograms) &&
          isEmpty(this.remoteWorkSelectedPrograms) &&
          isEmpty(this.volunteeringSelectedPrograms)) ||
        this.isNotRelevantProgramAndNotAllowedChangeOnwardTrip
      );
    },
    getSelectedPrograms(): Program[] {
      return this.fellowshipSelectedPrograms
        ?.concat(this.remoteWorkSelectedPrograms)
        ?.concat(this.volunteeringSelectedPrograms);
    },
  },
  actions: {
    async getPrograms(mockNoPrograms: boolean = false) {
      if (!isEmpty(this.programs) && !mockNoPrograms) {
        return;
      }

      const {
        campusId,
        gender,
        studentValue,
        peerQuestionValue,
        isAllowAlumniRegistration,
      } = useApplicationStore().dataForAlgorithmPrograms;
      const { applicationId } = useUserStore();
      const { mailingCountryCode, dateOfBirth } =
        useUserStore().contactInformation;
      await useSeasonStore().getAvailableSeasons();
      const availableSeasons = useSeasonStore().availableSeasons;
      const seasonCodes = availableSeasons?.map((season) => season.id);
      useModalsStore().openModal(ModalNames.pleaseWait);

      const programs = await FormBuilderApi.getOnwardPrograms({
        gender,
        campusId,
        seasonCodes,
        applicationId,
        mockNoPrograms,
        countryIsoCode: mailingCountryCode,
        isStudent: studentValue !== "No",
        isPeerFromUniversity: peerQuestionValue === PeerFromUniversity,
        isAllowAlumniRegistration,
        dateOfBirth,
      });

      useModalsStore().closeModal(ModalNames.pleaseWait);
      this.programs = this.transformPrograms(
        this.filterNotRelevantPrograms(programs)
      );
      this.programsPulled = true;

      this.handleProgramUrlParam();
      if (!this.selectedProgramFromUrlParam) {
        //  show only programs that are visible in market
        this.programs = this.programs.filter(
          (program) => program.isVisibleInMarket === 1
        );
      } else {
        // show only the selected program
        this.programs = this.programs.filter((program) =>
          compareAsStrings(program.tdmId, this.urlParams.program)
        );
      }
    },

    handleProgramUrlParam() {
      //  if already has programs saved in SF, don't select program from url param
      const applicationPrograms = this.applicationPrograms;
      if (!isEmpty(applicationPrograms)) {
        return;
      }

      //  If received program url param, select the program if exists
      const programUrlParam = this.urlParams.program;
      const program = programUrlParam
        ? this.programs.find(
            (program) => String(program.tdmId) === programUrlParam
          )
        : null;

      if (!programUrlParam || !program) {
        return this.handleOrgAndPartnerParams();
      }

      this.selectProgram(program);
      this.selectedProgramFromUrlParam = true;
    },

    handleOrgAndPartnerParams() {
      const { organizerId, partnerId } = this.urlParams;
      if (organizerId && partnerId) {
        this.programs = this.programs.filter((program) => {
          return (
            compareAsStrings(program.organizerId, organizerId) &&
            compareAsStrings(program.partnerId, partnerId)
          );
        });
      } else if (organizerId) {
        this.programs = this.programs.filter((program) =>
          compareAsStrings(program.organizerId, organizerId)
        );
      } else if (partnerId) {
        this.programs = this.programs.filter((program) =>
          compareAsStrings(program.partnerId, partnerId)
        );
      }
    },

    async saveSelectedPrograms() {
      const { contactId, activeApplicationId: applicationId } =
        useUserStore().ids;
      let data: UpdateOnwardApplicantDto = {
        applicationId: applicationId,
        contactId: contactId,
      };

      data = getSelectedProgramsData(this.getSelectedPrograms, data);

      useModalsStore().openModal(ModalNames.pleaseWait);
      const response = await UserRegistrationApi.setOnwardProgram(data);
      useModalsStore().closeModal(ModalNames.pleaseWait);
      if (!response) {
        return;
      }

      this.setSelectedProgramsAsApplicationPrograms();
      this.isProgramSaved = true;

      useFormNavigationStore().selectedTab.completed = true;
      useFormNavigationStore().nextTab();
      useFormNavigationStore().selectedTab.isLocked = false;
    },

    selectProgram(programToSelect: Program) {
      switch (programToSelect?.programId) {
        case OnwardTypeProgramEnum.FELLOWSHIP:
          this.fellowshipSelectedPrograms.push(programToSelect);
          break;
        case OnwardTypeProgramEnum.REMOTE_WORK:
          this.remoteWorkSelectedPrograms.push(programToSelect);
          break;
        case OnwardTypeProgramEnum.VOLUNTEERING:
          this.volunteeringSelectedPrograms.push(programToSelect);
      }
    },

    resetSelectedPrograms() {
      this.volunteeringSelectedPrograms = [];
      this.fellowshipSelectedPrograms = [];
      this.remoteWorkSelectedPrograms = [];
    },

    setSelectedProgramsAsApplicationPrograms() {
      this.applicationPrograms = [
        ...this.volunteeringSelectedPrograms,
        ...this.fellowshipSelectedPrograms,
        ...this.remoteWorkSelectedPrograms,
      ];
      this.resetSelectedPrograms();
    },

    removeProgram(programIdToRemove: number) {
      switch (programIdToRemove) {
        case OnwardTypeProgramEnum.FELLOWSHIP:
          this.fellowshipSelectedPrograms = [];
          break;
        case OnwardTypeProgramEnum.REMOTE_WORK:
          this.remoteWorkSelectedPrograms = [];
          break;
        case OnwardTypeProgramEnum.VOLUNTEERING:
          this.volunteeringSelectedPrograms = [];
      }
    },

    setApplicationPrograms(programs: Program[]) {
      this.applicationPrograms = this.transformPrograms(programs);
    },

    setNotRelevantApplicationPrograms(notRelevantPrograms: Program[]) {
      this.notRelevantApplicationPrograms = notRelevantPrograms;
    },

    setPrograms(programs: Program[]): void {
      this.programs = programs;
    },

    transformPrograms(programs: Program[]): Program[] {
      return programs.map((program) => {
        program.tripFromDate = dayjs(program.tripFromDate).format(
          "MMMM D, YYYY"
        );
        program.tripDuration = `${(parseInt(program.tripDuration) / 7).toFixed(
          0
        )}`;
        program.programPriority = getProgramPriority(program);
        return program;
      });
    },

    filterNotRelevantPrograms(programs: Program[]): Program[] {
      if (!isEmpty(this.notRelevantApplicationPrograms)) {
        return programs.filter((program) => {
          const tdmId = program.tdmId;
          return !this.notRelevantApplicationPrograms.some(
            (notRelevantProgram) => notRelevantProgram.tdmId === tdmId
          );
        });
      }

      return programs;
    },
    setProgramUrlParam(tripId: string) {
      this.urlParams.program = tripId;
    },
    setOrgUrlParam(org: string) {
      this.urlParams.organizerId = org;
    },
    setPartnerUrlParam(partner: string) {
      this.urlParams.partnerId = partner;
    },
    clearUrlFromLocalStorage(key: string): void {
      localStorage[key] = "";
    },
    cleanState() {
      this.programs = [];
      this.applicationPrograms = null;
      this.programsPulled = false;
      this.selectedProgramFromUrlParam = false;
      this.fellowshipSelectedPrograms = [];
      this.remoteWorkSelectedPrograms = [];
      this.volunteeringSelectedPrograms = [];
      this.isProgramSaved = false;
      this.urlParams = {
        program: "",
        organizerId: "",
        partnerId: "",
      };
      this.notRelevantApplicationPrograms = null;
    },
  },
});
