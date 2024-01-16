<template>
  <div class="tabsList">
    <component
      v-for="(tab, index) in tabs"
      :is="tabComponent"
      :key="tab.order"
      :index="index"
      :tab="tab"
      :tabsCount="tabs.length"
    />
  </div>
</template>

<script setup lang="ts">
import Tab from '@/Modules/Common/Components/Form/Tab/Tab.vue';
import OnwardTab from '@/Modules/Onward/Components/OnwardTab/OnwardTab.vue';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';

const tabs = computed(() => useFormNavigationStore().tabs);
const tabComponent = computed(() => {
  switch (useProduct().product.value) {
    case TaglitProduct.EXCEL:
      return Tab;
    case TaglitProduct.ONWARD:
      return OnwardTab;
  }
});
</script>

<style scoped lang="scss">
.tabsList {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
}
</style>
