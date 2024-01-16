<template>
  <div
    :class="classNameAndProduct(['section', { isClose: !section.isOpen }])"
    :data-qa-id="section.uniqueName"
    v-if="section.isVisible"
  >
    <SectionHeader :section="section" />
    <SlideTransition>
      <div class="content" v-show="section.isOpen">
        <slot name="content"></slot>
      </div>
    </SlideTransition>
  </div>
</template>
<script lang="ts" setup>
import { FormSection } from '@/Modules/Common/Entities/Section';
import SectionHeader from '@/Modules/Common/Components/Form/Section/SectionHeader.vue';
import SlideTransition from '@/Modules/Common/Components/Form/Section/SlideTransition.vue';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';
defineProps<{ section: FormSection }>();

const { classNameAndProduct } = useGenerateNameStyle();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.section {
  max-width: 1020px;
  width: 100%;
  border: solid 1px $dark-blue;
  border-radius: 5px;
  margin-bottom: 40px;

  @include tablet {
    width: calc(100% - 48px);
  }

  &.onward {
    border: solid 2px $bright-gray;
    margin-bottom: 20px;

    &.isClose {
      border: solid 1px $bright-gray;
    }
  }
}
</style>
