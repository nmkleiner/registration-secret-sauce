<template>
  <TheHeader v-if="!isMobile" />
  <TheHeaderMobile v-else />
  <div class="page">
    <template v-if="selectedTab">
      <TabsList />
      <MyProgramsTab v-if="isProgramsTab" />
      <TabSections v-else />
      <NavigationButtons v-if="useProduct().isOnward.value" />
    </template>
    <div id="teleportModals" />
  </div>
  <TheFooter v-if="isShowFooter" />
</template>
<script lang="ts" setup>
import TheHeader from '@/Modules/Common/Components/Header/TheHeader.vue';
import { useLogin } from '@/Core/Composables/login/useLogin';
import TabSections from '@/Modules/Common/Components/Form/Tab/TabSections.vue';
import TabsList from '@/Modules/Common/Components/Form/Tab/TabsList/TabsList.vue';
import { useMobileHandler } from '@/Core/Composables/mobileHandler';
import TheHeaderMobile from '@/Modules/Common/Components/Header/TheHeaderMobile.vue';
import TheFooter from '@/Modules/Excel/Components/Footer/TheFooter.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { isMyProgramsTab } from '@/Modules/Onward/Helpers/is-my-programs-tab';
import MyProgramsTab from '@/Modules/Onward/Components/Tab/MyProgramsTab/MyProgramsTab.vue';
import NavigationButtons from '@/Modules/Onward/Components/Tab/NavigationButtons/NavigationButtons.vue';
import { getProductFontFamily } from '@/Core/Constants/product-style.constants';

const selectedTab = computed(() => useFormNavigationStore().selectedTab);
const { isMobile } = useMobileHandler();
const isShowFooter = computed(() => useProduct().isExcel.value);
const isProgramsTab = computed(
  () => useProduct().isOnward.value && isMyProgramsTab(selectedTab.value),
);

onBeforeMount(async () => {
  await useApplicationStore().getFormData();
});

// activate watch on contactId
useLogin();
useFormNavigationStore().initParams();

const fontFamily = getProductFontFamily();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.page {
  min-height: 640px;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: v-bind(fontFamily);

  @include phone {
    margin-top: 105px;
  }
}
</style>
