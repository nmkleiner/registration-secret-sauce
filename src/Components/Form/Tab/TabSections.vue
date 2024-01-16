<template>
  <SectionComponent
    v-for="formSection in selectedTab.sections"
    :key="formSection.id"
    :section="formSection"
  >
    <template #content>
      <FormSectionComponent :formSection="formSection" />
    </template>
  </SectionComponent>
</template>
<script lang="ts" setup>
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import SectionComponent from '@/Modules/Common/Components/Form/Section/SectionComponent.vue';
import FormSectionComponent from '@/Modules/Common/Components/Form/Section/FormSectionComponent.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { useProduct } from '@/Core/Composables/program/useProduct';

const selectedTab = computed(() => useFormNavigationStore().selectedTab);

const isViewOnlyApplication = computed(() => useApplicationStore().isViewOnlyApplication);
watch(
  isViewOnlyApplication,
  (value) => {
    if (!useProduct().isExcel.value) {
      return;
    }

    const allSections = useFormNavigationStore().allSections;
    if (value) {
      allSections.forEach((section) => section.lock());
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
</style>
