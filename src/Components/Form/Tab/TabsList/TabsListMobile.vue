<template>
  <div :class="tabsListClasses">
    <div class="arrowWrapper left">
      <FontAwesomeIcon
        class="icon"
        icon="fa-solid fa-chevron-left"
        @click="currentPage--"
        v-if="showLeftArrow"
      />
    </div>
    <component
      v-for="(tab, index) in currentTabs"
      :is="tabComponent"
      :key="tab.order"
      :tab="tab"
      :index="index"
      :tabsCount="tabs.length"
      :mobile="true"
    />
    <div class="arrowWrapper right">
      <FontAwesomeIcon
        class="icon"
        icon="fa-solid fa-chevron-right"
        @click="currentPage++"
        v-if="showRightArrow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tab from '@/Modules/Common/Components/Form/Tab/Tab.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import OnwardTab from '@/Modules/Onward/Components/OnwardTab/OnwardTab.vue';

const tabs = computed(() => useFormNavigationStore().tabs);
const selectedTab = computed(() => useFormNavigationStore().selectedTab);

const currentPage = ref(0);
const hasPagination = computed(() => tabs.value.length > 3);
const tabsListClasses = computed(() => ['tabsList', { scroll: useProduct().isOnward.value }]);
const showLeftArrow = computed(
  () => currentPage.value > 0 && hasPagination.value && !useProduct().isOnward.value,
);
const showRightArrow = computed(
  () => currentPage.value === 0 && hasPagination.value && !useProduct().isOnward.value,
);
const tabComponent = computed(() => {
  switch (useProduct().product.value) {
    case TaglitProduct.EXCEL:
      return Tab;
    case TaglitProduct.ONWARD:
      return OnwardTab;
  }
});
// for excel - only show 3 tabs based on pagination
// for onward - all tabs
const currentTabs = computed(() => {
  if (!hasPagination.value) {
    return tabs.value;
  }

  if (useProduct().isOnward.value) {
    return tabs.value;
  }

  const start = currentPage.value * 3;
  const end = start + 3;
  return tabs.value.slice(start, end);
});
const fixCurrentPageOnTabChange = (selectedTab: Tab) => {
  if (!hasPagination.value) {
    return;
  }

  if (selectedTab && selectedTab.order > 3) {
    currentPage.value = 1;
  }
};
const listWidth = computed(() => {
  if (hasPagination.value) {
    return 'calc(100% - 48px)';
  } else {
    return 'auto';
  }
});

watch(selectedTab, fixCurrentPageOnTabChange, { immediate: true });
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.tabsList {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: v-bind(listWidth);

  .arrowWrapper {
    display: flex;
    align-items: center;
    width: 48px;
    height: 48px;

    &.left {
      justify-content: flex-start;
    }

    &.right {
      justify-content: flex-end;
    }

    .icon {
      font-size: 16px;
      color: $dark-blue;
    }
  }

  &.scroll {
    overflow-x: scroll;
    max-width: 100%;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
