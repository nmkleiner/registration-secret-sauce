<template>
  <div class="checkboxes">
    <div v-if="input.options.length > 0">
      <Title :required="isRequired" :title="input.label" />
      <div class="grid">
        <template v-for="option in input.options" :key="option.id">
          <CheckboxWithValidation v-if="option.isVisible" :group="input" :option="option" />
        </template>
      </div>
    </div>

    <CheckboxWithValidation
      v-else-if="isOnward"
      :option="option"
      :group="input"
      :isBooleanValue="true"
      :selected="isOptionSelected"
    />

    <div class="errorContainer">
      <ErrorMessage class="error" :name="input.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';
import Title from '@/Modules/Common/Components/Form/Inputs/Title/Title.vue';
import CheckboxWithValidation from '@/Modules/Common/Components/Form/Inputs/Checkboxes/CheckboxWithValidation.vue';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';
import { CheckboxOption } from '@/Modules/Common/Entities/Options/checkbox-option';
import { useProduct } from '@/Core/Composables/program/useProduct';

const props = defineProps<{ input: InputWithMultiSelect }>();

const isRequired = computed(() => useCommonComponentLogic().isInputRequired(props.input));

const option = computed(() => {
  return new CheckboxOption({
    id: props.input.id,
    name: props.input.label,
    sort: props.input.sort,
    mapping: null,
  });
});
const isOnward = useProduct().isOnward.value;
const isOptionSelected = computed(() => {
  if (isOnward) {
    if (typeof props.input.value === 'string') {
      return props.input.value === 'true';
    }
  }
  return Boolean(props.input.value);
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.checkboxes {
  width: 100%;
  position: relative;

  .title {
    margin-top: 12px;
    margin-bottom: 20px;
    font-size: 16px;
    color: $dark-gray;
  }

  .grid {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: repeat(1, 1fr);

    @include desktop-only {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .errorContainer {
    width: 100%;
    text-align: left;
  }
}
</style>
