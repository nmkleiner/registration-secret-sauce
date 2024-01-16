<template>
  <div :class="{ hideArrows, disabled }" class="selector">
    <div :class="{ disabled: lockPrevious }" class="backArrow arrow" @click="handlePrevious">
      <FontAwesomeIcon icon="chevron-left" />
    </div>
    <div class="container pointer" :data-qa-id="dataQaId" @click="handleOpenList">
      <div class="selection" v-text="selectionText"></div>
      <div class="downArrow arrow">
        <FontAwesomeIcon :class="{ rotate: isListOpen }" icon="fa-solid fa-caret-down" />
      </div>
    </div>
    <div :class="{ disabled: lockNext }" class="nextArrow arrow" @click="handleNext">
      <FontAwesomeIcon icon="chevron-right" />
    </div>

    <div ref="list" class="list" v-if="isListOpen">
      <div
        class="item"
        v-for="item in items"
        @click="handleItemSelected(item.value)"
        :data-qa-id="item.label"
        :class="{ selected: isSelectedItem(item.value) }"
      >
        <span>{{ item.label }}</span>
        <div class="check" v-if="isSelectedItem(item.value)">
          <FontAwesomeIcon :icon="['fal', 'check']" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = withDefaults(
  defineProps<{
    selectionText: string;
    dataQaId: string;
    items: { value: number; label: string }[];
    selectedItem: number;
    isListOpen: boolean;
    lockNext?: boolean;
    lockPrevious?: boolean;
    disabled?: boolean;
    hideArrows?: boolean;
    shouldScrollToBottom?: boolean;
  }>(),
  {
    lockNext: false,
    lockPrevious: false,
    disabled: false,
    hideArrows: false,
    shouldScrollToBottom: false,
  },
);

const emit = defineEmits<{
  next: () => void;
  previous: () => void;
  openList: () => void;
  itemSelected: (item: number) => void;
}>();

const list = ref();
const scrollToListBottom = async () => {
  if (props.shouldScrollToBottom === false) {
    return;
  }
  await nextTick();
  if (list.value) {
    // calculate where current year is in the list
    list.value.scroll({ top: 40 * (props.items.length - 57) });
  }
};
watch(() => props.isListOpen, scrollToListBottom);
const isSelectedItem = (item: number) => item === props.selectedItem;
const handleNext = () => {
  if (props.lockNext) {
    return;
  }
  emit('next');
};
const handlePrevious = () => {
  if (props.lockPrevious) {
    return;
  }
  emit('previous');
};
const handleOpenList = () => {
  if (props.disabled) {
    return;
  }
  emit('openList');
};
const handleItemSelected = (item: number) => emit('itemSelected', item);
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.selector {
  display: flex;
  align-items: center;
  color: $dark-blue;
  user-select: none;

  .container {
    display: flex;
    align-items: center;
    margin: 0 13px;
  }

  .arrow {
    font-size: 12px;
    padding: 10px 12px;
    cursor: pointer;

    &.downArrow {
      padding: 0;
      margin-left: 8px;

      svg {
        transition: 0.2s;
        &.rotate {
          transform: rotate(180deg);
        }
      }
    }

    &.disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    left: -8px;
    transform: translateY(100%);
    z-index: 3;
    background-color: $white;
    width: calc(100% + 16px);
    text-align: left;
    max-height: calc(40px * 7);
    overflow-y: scroll;
    border-radius: 0 0 6px 6px;
    border-top: solid 1px rgba(1, 47, 93, 0.34);

    &::-webkit-scrollbar {
      display: none;
    }

    .item {
      display: flex;
      justify-content: space-between;
      height: 40px;
      padding: 16px 16px 10px;
      transition: 0.1s;

      &:hover {
        background-color: $blue-azure-opacity;
      }

      &.selected {
        background-color: $blue-azure-opacity;
      }
    }
  }

  &.disabled {
    opacity: 0.3;
    cursor: default;

    .arrow {
      cursor: default;
      &:not(.downArrow) {
        visibility: hidden;
      }
    }

    .container {
      cursor: default;
    }
  }

  &.hideArrows {
    .arrow {
      &:not(.downArrow) {
        visibility: hidden;
      }
    }
  }
}
</style>
