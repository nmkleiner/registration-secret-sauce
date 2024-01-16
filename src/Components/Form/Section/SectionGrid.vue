<template>
  <div :class="classNameAndProduct(['sectionGrid'])">
    <Row>
      <template v-for="input in props.formSection.inputs">
        <DynamicInput
          v-if="input.isVisible"
          :key="input.id"
          :input="input"
          :form-section="formSection"
        />
      </template>
    </Row>
  </div>
</template>
<script lang="ts" setup>
import Row from '@/Modules/Common/Components/Wrappers/Row.vue';
import DynamicInput from '@/Modules/Common/Components/Form/Inputs/DynamicInput.vue';
import { FormSection } from '@/Modules/Common/Entities/Section';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';

const props = defineProps<{ formSection: FormSection }>();

const { classNameAndProduct } = useGenerateNameStyle();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.sectionGrid {
  padding-top: 20px;

  .row {
    flex-wrap: wrap;
    justify-content: flex-start;

    .column {
      align-items: flex-start;

      @include tablet {
        width: 100%;
      }
    }
  }

  ::v-deep(.label) {
    font-size: 16px;
  }

  &.onward {
    font-size: 14px;

    ::v-deep(.label) {
      font-size: 12px;
      color: $onward-label;
    }
  }
}
</style>
