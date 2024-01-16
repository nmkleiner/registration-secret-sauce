<template>
  <div class="sectionHeader" @click="props.section.toggleIsOpen">
    <Title :title="section.name" />
    <div :class="classNameAndProduct(['circle', { rotate, completed, locked }])">
      <FontAwesomeIcon v-if="locked" icon="fa-light fa-lock" />
      <FontAwesomeIcon v-else-if="completed" icon="fa-solid fa-circle-check" />
      <FontAwesomeIcon v-else icon="fa-light fa-chevron-down" class="" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Section } from '@/Modules/Common/Entities/Section/section';
import { FormSection } from '@/Modules/Common/Entities/Section/form-section';
import Title from '@/Modules/Common/Components/Form/Inputs/Title/Title.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';

const props = defineProps<{ section: Section | FormSection }>();

const { classNameAndProduct } = useGenerateNameStyle();
const rotate = computed((): boolean => {
  return !props.section.isOpen && !completed.value && !locked.value;
});

const completed = computed(() => {
  if (props.section instanceof FormSection) {
    return props.section.isCompleted;
  }
  return false;
});

const locked = computed(() => {
  if (props.section instanceof FormSection) {
    return props.section.isLocked;
  }
  return false;
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 20px;
  cursor: pointer;

  ::v-deep(.title) {
    width: calc(100% - 32px);
  }

  @include tablet {
    min-height: 70px;
    height: fit-content;
  }

  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: $dark-blue;
    border-radius: 50%;
    border: 1px solid $dark-blue;
    transition: 0.2s;

    svg {
      font-size: 16px;
    }

    &.completed {
      svg {
        color: $bright-green;
        font-size: 34px;
      }
    }

    &.locked {
      svg {
        color: $dark-blue;
        font-size: 16px;
      }
    }

    &.onward {
      border: 1px solid $bright-gray;
      color: $dark-gray-text;
    }
  }
}
</style>
