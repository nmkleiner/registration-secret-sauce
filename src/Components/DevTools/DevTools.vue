\
<template>
  <div class="devToolsButton" @click="toggle"></div>
  <div class="popup" v-if="popupOpen">
    <span
      v-if="applicationStore.formName"
      class="link"
      v-text="'Form: ' + applicationStore.formName"
    ></span>
    <span
      v-if="applicationStore.resourceId"
      class="link"
      v-text="'Form Id: ' + applicationStore.resourceId"
    ></span>
    <span v-if="activeApplicationId" class="link" @click="goToApplication"
      >Salesforce application</span
    >
    <span v-if="contactId" class="link" @click="goToContact">Salesforce contact</span>
    <span class="link" @click="goToExcelApplications">Excel applications season 48</span>
    <span class="link" @click="goToOnwardApplications">Onward applications season 48</span>
    <span class="link" @click="goToExcelApplicationFieldSets">Excel application field sets</span>
    <span class="link" @click="goToOnwardContactFieldSets">Onward application field sets</span>
    <span class="link" @click="goToTaglitom">Taglitom</span>
    <span class="link" @click="goToCMS">CMS</span>
    <span class="link" @click="createServerError" v-text="createServerErrorLabel"></span>
    <span v-if="useProduct().isOnward.value" class="link" @click="getNoPrograms">No programs</span>
    <span v-if="useProduct().isOnward.value" class="link" @click="unlockTabs">Unlock tabs</span>
    <span class="link" @click="reload">Reload</span>
    <span class="link" @click="() => copyString('баклажан')">Copy Russian Letters</span>
  </div>
</template>
<script lang="ts" setup>
import { useBooleanRef } from '@/Core/Composables/boolean-ref/useBooleanRef';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { useClipboard } from '@vueuse/core';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { useProgramStore } from '@/Modules/Onward/Store/Program/program.store';

const { ref: popupOpen, toggle } = useBooleanRef();
const applicationStore = useApplicationStore();
const contactId = computed(() => useUserStore().ids.contactId);
const activeApplicationId = computed(() => useUserStore().ids.activeApplicationId);
const email = computed(() => useUserStore().contactInformation.email);
const goToApplication = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/r/Application__c/${activeApplicationId.value}/view`,
  );
const goToContact = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/r/Contact/${contactId.value}/view`,
  );
const goToExcelApplications = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/r/Season_Setting__c/a0i7S000000seVaQAI/related/Application__r/view`,
  );
const goToOnwardApplications = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/r/Season_Setting__c/a0i7S000000seVyQAI/view`,
  );
const goToExcelApplicationFieldSets = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/setup/ObjectManager/01I1r000000natJ/FieldSets/0IX5I000000g3Z9WAI/view`,
  );
const goToOnwardContactFieldSets = () =>
  openUrl(
    `https://taglitbirthrightisrael--full.sandbox.lightning.force.com/lightning/setup/ObjectManager/01I1r000000natJ/FieldSets/0IX7S000000sa64WAA/view`,
  );
const goToTaglitom = () =>
  openUrl(
    `https://testtom.taglit-birthrightisrael.com/RegistrationForm.aspx?menu=AdminRegFormList`,
  );
const goToCMS = () => openUrl(`https://www.taglit.info/admin/user-portal`);
const openUrl = (url: string) => {
  useClipboard({ source: url, legacy: true }).copy(url);
  window.open(url);
};
const copyString = (str: string) => {
  useClipboard({ source: str, legacy: true }).copy(str);
};
const createServerErrorLabel = computed((): string => {
  return throwError.value ? 'I will throw error' : 'Throw error';
});
const throwError = computed((): boolean => useApplicationStore().throwError);
const createServerError = async (): Promise<void> => {
  useApplicationStore().toggleThrowError();
};
const unlockTabs = async (): Promise<void> => {
  useFormNavigationStore().tabs.forEach((tab) => {
    tab.unlock();
  });
};
const reload = async () => {
  await useApplicationStore().getFormData();
  useModalsStore().closeModal(ModalNames.pleaseWait);
};
const getNoPrograms = async () => {
  useProgramStore().resetSelectedPrograms();
  useProgramStore().getPrograms(true);
};
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.devToolsButton {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 32px;
  background-color: $primary;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  z-index: 2;
  width: 20px;

  @include desktop-only {
    width: 120px;
  }
}

.popup {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  bottom: 48px;
  left: 0;
  background-color: $primary;
  padding: 20px;
  border-radius: 4px;

  .link {
    cursor: pointer;
    color: white;
    margin: 5px 0;
    font-weight: bold;

    &:hover {
      color: $azure;
    }
  }
}
</style>
