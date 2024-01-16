import { first, last } from "lodash-es";

export function handleSectionSave(
  formSection: FormSection,
  selectedTab: RegistrationTab,
  tabs: RegistrationTab[]
) {
  const selectedTabSections = selectedTab.sections;

  if (formSection === last(selectedTabSections)) {
    selectNextTab(selectedTab, tabs);
  } else {
    scrollToNextSection(formSection, selectedTab);
  }
}

export function handleSectionSaveOnward(
  formSection: FormSection,
  selectedTab: RegistrationTab,
  tabs: RegistrationTab[]
) {
  const selectedTabSections = selectedTab.sections;

  setTimeout(() => {
    if (formSection === last(selectedTabSections)) {
      const otherTabSections = selectedTabSections.filter(
        (section) => section !== formSection
      );
      if (
        otherTabSections.some(
          (section) => !section.isCompleted && !section.saveInProcess
        )
      ) {
        return;
      }
      selectNextTab(selectedTab, tabs);
    } else {
      scrollToNextSection(formSection, selectedTab);
    }
  }, 1200);
}

export function selectNextTab(
  selectedTab: RegistrationTab,
  tabs: RegistrationTab[]
) {
  const selectedTabOrder = selectedTab.order;
  const nextTab = tabs.find((tab) => tab.order === selectedTabOrder + 1);

  if (nextTab) {
    setSelectedTab(nextTab, tabs);
    first(nextTab.sections)?.open().scrollToSection();
  }
}

export function scrollToNextSection(
  formSection: FormSection,
  selectedTab: RegistrationTab
) {
  const selectedTabSections = selectedTab.sections;
  const nextSection = selectedTabSections.find(
    (section) => section.order > formSection.order && section.isVisible
  );

  nextSection?.open().scrollToSection();
}

export function setSelectedTab(tab: RegistrationTab, tabs: RegistrationTab[]) {
  tabs.forEach((tab) => tab.unselect());
  tab.select();

  router.push({ query: { tab: tab.order } });
}
