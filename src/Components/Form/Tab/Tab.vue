<template>
  <div :class="tabClasses" @click="selectTab">
    <FontAwesomeIcon v-if="tab.completed" class="check" icon="fa-solid fa-circle-check" />
    <div class="iconWrapper">
      <FontAwesomeIcon class="icon" :icon="tab.icon" />
    </div>
    <div class="label" v-text="tab.text"></div>

    <div class="connectingLine" v-if="mobile"></div>
  </div>
</template>
<script lang="ts" setup>
import { RegistrationTab } from '@/Modules/Common/Entities/Tab/registration-tab';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { useProduct } from '@/Core/Composables/program/useProduct';

const props = withDefaults(
  defineProps<{ tab: RegistrationTab; tabsCount: number; index: number; mobile?: boolean }>(),
  {
    mobile: false,
  },
);

const tabClasses = computed(() => [
  'tab pointer',
  {
    selected: props.tab.isSelected,
    completed: props.tab.completed,
    last: lastInPage.value,
  },
]);

function selectTab() {
  if (props.tab.isLocked) {
    return;
  }
  useFormNavigationStore().setSelectedTab(props.tab);
}

const lastInPage = computed(() => {
  if (props.tabsCount < 3) {
    return props.tabsCount === props.index + 1;
  }

  return props.tab.order % 3 === 0;
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.tab {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 92px;
  margin-right: 40px;
  color: $dark-blue;

  &:last-child {
    margin-right: 0;
  }

  &.selected {
    color: $bright-azure;
  }

  .icon {
    font-size: 40px;
    margin-bottom: 16px;
  }

  .label {
    font-size: 16px;
    text-align: center;
  }

  .check {
    background-color: $white;
    border-radius: 20px;
    position: absolute;
    top: -5px;
    right: 8px;
    color: $bright-green;
  }

  .connectingLine {
    position: absolute;
    width: 43px;
    height: 1px;
    opacity: 0.4;
    background-color: #012f5d;
    top: 25px;
    right: -50px;
  }

  @include tablet {
    margin-right: 56px;
    width: 48px;

    .iconWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border: 1px solid $gray-opacity-border;
      border-radius: 50px;
      margin-bottom: 10px;

      .icon {
        font-size: 20px;
        margin-bottom: 0;
      }
    }

    &.completed {
      color: $dark-blue;

      .iconWrapper {
        border: 2px solid $bright-green;
      }
    }

    &.selected {
      color: $bright-azure;

      .iconWrapper {
        border: 2px solid $bright-azure;
      }
    }

    .check {
      background-color: $white;
      border-radius: 20px;
      font-size: 20px;
      top: 0;
      right: -4px;
    }

    .label {
      font-size: 12px;
    }

    &.last {
      margin-right: 0;

      .connectingLine {
        display: none;
      }
    }
  }
}
</style>
