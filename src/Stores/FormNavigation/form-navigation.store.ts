import { defineStore } from "pinia";
import { useApplicationStore } from "../Application/application.store";
import { FormNavigationState } from "./form-navigation-state.interface";
import {
  handleSectionSave,
  handleSectionSaveOnward,
  setSelectedTab,
} from "./helpers";
import { usePaymentStore } from "../Payment/payment.store";
import { useConfig } from "../../Config/use-config.ts";
import { TaglitProduct } from "../../Enums";
import { RawFormSection, RegistrationStage } from "../../Interfaces";
import { useProgramStore } from "../Program/program.store.ts";

export const useFormNavigationStore = defineStore("FormNavigation", {
  state: (): FormNavigationState => ({
    EXCEL: {
      phase1Tabs: [],
      phase2Tabs: [],
    },
    ONWARD: {
      tabs: [],
    },
    queryParams: {},
    fullLoginUrl: "",
  }),
  getters: {
    tabs(): RegistrationTab[] {
      const product = useConfig().getProduct();
      switch (product) {
        case TaglitProduct.EXCEL:
          return useApplicationStore().activePhase === 1
            ? (this.EXCEL.phase1Tabs as RegistrationTab[])
            : (this.EXCEL.phase2Tabs as RegistrationTab[]);
        case TaglitProduct.ONWARD:
          return this.ONWARD.tabs as RegistrationTab[];
      }
    },
    selectedTab(): RegistrationTab {
      return this.tabs.find((tab: RegistrationTab) => tab.isSelected);
    },
    allSections(): FormSection[] {
      return this.tabs.reduce((acc, tab) => [...acc, ...tab.sections], []);
    },
    getSectionByUniqueName(): (
      uniqueName: SectionNames | OnwardSectionNames
    ) => FormSection {
      return (uniqueName: SectionNames | OnwardSectionNames): FormSection => {
        return this.allSections.find(
          (section) => section.uniqueName === uniqueName
        );
      };
    },
    getSectionIndexInTabByUniqueName(): (
      uniqueName: SectionNames,
      indexTab: number
    ) => number {
      return (uniqueName: SectionNames, indexTab: number): number => {
        return this.tabs[indexTab].sections.findIndex(
          (section) => section.uniqueName === uniqueName
        );
      };
    },
    selectedIndexTab(): number {
      return this.tabs.findIndex((tab: RegistrationTab) => tab.isSelected);
    },
  },
  actions: {
    initParams() {
      this.queryParams = {
        ...this.queryParams,
        ...router.currentRoute.value.query,
      };
      if (useConfig().getProduct() === "ONWARD") {
        const { tripid, org, partner } = this.queryParams;
        const { setProgramUrlParam, setOrgUrlParam, setPartnerUrlParam } =
          useProgramStore();

        tripid
          ? setProgramUrlParam(String(tripid))
          : useProgramStore().clearUrlFromLocalStorage("programUrlParam");
        org
          ? setOrgUrlParam(String(org))
          : useProgramStore().clearUrlFromLocalStorage("organizerUrlParam");
        partner
          ? setPartnerUrlParam(String(partner))
          : useProgramStore().clearUrlFromLocalStorage("partnerUrlParam");
      }
    },
    initFullLoginUrl() {
      this.fullLoginUrl = window.location.href;
    },
    initNavigation(
      registrationStages: RegistrationStage[],
      rawFormSections: RawFormSection[]
    ) {
      const program = useConfig().getProduct();
      switch (program) {
        case TaglitProduct.EXCEL:
          this.initExcelTabs(registrationStages, rawFormSections);
          break;
        case TaglitProduct.ONWARD:
          this.initOnwardTabs(registrationStages, rawFormSections);
          break;
      }

      this.initSelectedTab();
    },
    initSelectedTab() {
      const goToProgramActive = this.handleGoToProgramParam();
      if (goToProgramActive) {
        return;
      }

      const goToActive = this.handleGoToParam();
      if (goToActive) {
        return;
      }

      const depositActive = this.handleDepositSection();
      if (depositActive) {
        return;
      }

      const consularCheckActive = this.handleConsularCheck();
      if (consularCheckActive) {
        return;
      }

      const tabParamActive = this.handleTabParam();
      if (tabParamActive) {
        return;
      }

      const initialTab = this.tabs.find((tab) => !tab.completed);
      if (initialTab) {
        this.setSelectedTab(initialTab);
        const incompleteSection = initialTab.sections.find(
          (section) => !section.isCompleted
        );
        if (incompleteSection) incompleteSection.open().scrollToSection();
      }
    },
    initExcelTabs(
      stages: RegistrationStage[],
      rawFormSections: RawFormSection[]
    ) {
      const phase1Sections = rawFormSections.filter(
        (section) => section.registrationPhase === 1
      );
      const phase1Stages = stages.filter((stage) => stage.phase === 1);
      this.EXCEL.phase1Tabs = registrationTabFactory(
        phase1Stages,
        phase1Sections
      );

      const phase2Sections = rawFormSections.filter(
        (stage) => stage.registrationPhase === 2
      );
      const phase2Stages = stages.filter((stage) => stage.phase === 2);
      this.EXCEL.phase2Tabs = registrationTabFactory(
        phase2Stages,
        phase2Sections
      );
    },
    initOnwardTabs(
      stages: RegistrationStage[],
      rawFormSections: RawFormSection[]
    ) {
      const setProgramTabStatus = () => {
        const myProgramTab = this.tabs.find(isMyProgramsTab);

        if (myProgramTab) {
          myProgramTab.completed = true;
          const nextTab = this.tabs.find(
            (tab) => tab.order === myProgramTab.order + 1
          );

          if (nextTab) {
            nextTab.isLocked = false;
          }
        }
      };

      this.ONWARD.tabs = registrationTabFactory(stages, rawFormSections);
      this.evaluateOnwardTabsLockStatus();
      if (useProgramStore().applicationPrograms?.length) {
        setProgramTabStatus();
      }
    },

    /**
     * @returns true if the program tab was selected based on the gotoprogram param
     * */
    handleGoToProgramParam(): boolean {
      const goToProgramParam = this.queryParams.go_to_program;
      if (typeof goToProgramParam !== "string") {
        return false;
      }

      const tab = this.tabs.find(isMyProgramsTab);
      if (!tab || tab.isLocked) {
        return false;
      }

      this.setSelectedTab(tab);
      return true;
    },
    /**
     * @returns true if the tab was selected based on the goto param
     * */
    handleGoToParam(): boolean {
      const goToParam = this.queryParams.goto;
      if (typeof goToParam !== "string") {
        return false;
      }

      const param = goToParam.toLowerCase();
      const section = this.allSections.find(
        (section) => section.uniqueName.toLowerCase() === param
      );
      if (!section) {
        return false;
      }

      const tab = section.tab;
      if (!tab || tab.isLocked) {
        return false;
      }

      this.setSelectedTab(tab);
      tab.sections.forEach((section) => section.close());
      section.open().scrollToSection();

      return true;
    },
    /**
     * opens the consular check section if the application is at phase 2
     * */
    handleConsularCheck(): boolean {
      if (!useApplicationStore().isPhase2Application) {
        return false;
      }

      // If the application is at phase 2 - open the Consular Checks section
      const consularChecksSection = this.allSections.find(
        (section) => section.uniqueName === OnwardSectionNames.consularChecks
      );
      const consularChecksSectionTab = consularChecksSection.tab;

      if (consularChecksSectionTab.isLocked) {
        return false;
      }

      this.setSelectedTab(consularChecksSectionTab);
      consularChecksSection.open().scrollToSection();

      return true;
    },

    /**
     * Open deposit section if allowPayment = true & status = Unpaid
     */
    handleDepositSection() {
      const allowPayment = usePaymentStore().allowPayment;
      const paymentStatus = usePaymentStore().status;

      if (allowPayment && paymentStatus === "Unpaid") {
        const submitSection = this.allSections?.find((section) =>
          isSubmitSection(section)
        );
        const submitSectionTab = submitSection?.tab;
        this.setSelectedTab(submitSectionTab);
        submitSection.open().scrollToSection();

        return true;
      }
    },

    handleTabParam(): boolean {
      const tabParam = this.queryParams.tab;
      const selectedTabIndex = Number(tabParam);
      const selectedTab = selectedTabIndex
        ? this.tabs.find((tab) => tab.order === selectedTabIndex)
        : null;

      if (!selectedTab || selectedTab.isLocked) {
        return false;
      }

      this.setSelectedTab(selectedTab);
      return true;
    },
    /*
     * called on init and on form save
     * */
    evaluateOnwardTabsLockStatus() {
      if (useConfig().getProduct() === "ONWARD") {
        const { hasIneligibleError } = useApplicationStore();
        this.tabs.forEach((tab, index) => {
          const previousTab = this.tabs[index - 1];
          if (tab.uniqueName === "Travel (O)" && hasIneligibleError) {
            // Prevent unlocking the Travel for ineligible applicant
            tab.lock();
            return;
          }

          if (!previousTab) {
            tab.unlock();
            return;
          }

          if (isMyProgramsTab(tab)) {
            isCompletedTabsBeforeCurrentTab(index) ? tab.unlock() : tab.lock();
            return;
          }

          if (previousTab.completed) {
            tab.unlock();
            return;
          }

          tab.lock();
        });
      }
    },
    setSelectedTab(tab: RegistrationTab) {
      const tabs = this.tabs;
      setSelectedTab(tab, tabs);
    },
    resetNavigation() {
      this.EXCEL.phase1Tabs = [];
      this.EXCEL.phase2Tabs = [];
    },
    handleSectionSave(formSection: FormSection) {
      const selectedTab = this.selectedTab;
      const tabs = this.tabs;

      useConfig().getProduct() === "ONWARD"
        ? handleSectionSaveOnward(formSection, selectedTab, tabs)
        : handleSectionSave(formSection, selectedTab, tabs);
    },
    isNotInRange(index: number) {
      return index < 0 || index > this.tabs.length - 1;
    },
    isFirstTab() {
      return this.selectedIndexTab === 0;
    },
    isLastTab() {
      return this.selectedIndexTab === this.tabs.length - 1;
    },
    isPreviousTabDisabled() {
      return this.disabledTab(-1);
    },
    isNextTabDisabled() {
      return this.disabledTab(1);
    },
    disabledTab(delta: number) {
      const index = this.selectedIndexTab + delta;
      if (this.isNotInRange(index)) {
        return false;
      }
      return this.tabs[index].isLocked;
    },
    previousTab() {
      this.switchTab(-1);
    },
    nextTab() {
      this.switchTab(1);
    },
    switchTab(delta: number) {
      const index = this.selectedIndexTab + delta;
      if (this.isNotInRange(index)) {
        return;
      }

      this.setSelectedTab(this.tabs[index]);
    },
    cleanState() {
      if (useConfig().getProduct() === "ONWARD") {
        this.ONWARD.tabs = [];
      } else {
        this.EXCEL.phase1Tabs = [];
        this.EXCEL.phase2Tabs = [];
      }
      this.queryParams = {};
      this.fullLoginUrl = "";
    },
  },
});
