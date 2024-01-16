<template>
  <div class="waiverWrapper">
    <div :class="waiverClasses" @click.prevent="openWaiverIfIsOnward">
      {{ headline.label }}
      <span class="button_popup" @click.prevent="openWaiverModal">{{ headline.button }}</span>
    </div>
    <CheckboxWithValidation
      :group="input"
      :key="getCheckboxOption().id"
      :option="getCheckboxOption()"
      :selected="selected"
      is-boolean-value
    />
    <div class="errorContainer" v-if="isOnward">
      <ErrorMessage class="error" :name="input.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import CheckboxWithValidation from '@/Modules/Common/Components/Form/Inputs/Checkboxes/CheckboxWithValidation.vue';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { ExcelSectionNames } from '@/Modules/Excel/Enums/excel-section-names.enum';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { ErrorMessage } from 'vee-validate';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';

const props = defineProps<{ input: InputWithMultiSelect }>();
const product = useProduct().product.value;
const isOnward = useProduct().isOnward.value;

const openWaiverModal = () => useModalsStore().openModal(ModalNames.waiver);
const headline = computed(() => {
  const option = getLabelOption();
  const label = option.label.replace(/[{{}}]/g, '');
  const lastIndex = label.lastIndexOf(' ');
  const newLabel = label.substring(0, lastIndex);
  const buttonValue = label.substring(lastIndex);

  return {
    label: newLabel,
    button: buttonValue,
  };
});

const waiverClasses = computed(() => ['headline', { onward: isOnward }]);
const selected = computed(() => {
  if (isOnward) {
    if (typeof props.input.value === 'string') {
      return props.input.value === 'true';
    }
  }
  return Boolean(props.input.value);
});
const openWaiverIfIsOnward = () => {
  isOnward && openWaiverModal();
};

function getCheckboxOption() {
  switch (product) {
    case TaglitProduct.EXCEL:
      return props.input.options[1];
    case TaglitProduct.ONWARD:
      return props.input.options[0];
  }
}

function getLabelOption() {
  switch (product) {
    case TaglitProduct.EXCEL:
      return props.input.options[0];
    case TaglitProduct.ONWARD:
      return props.input.options[2];
  }
}

function validateOptions() {
  const { options } = props.input;

  z.array(
    z.object({
      id: z.string(),
      isVisible: z.boolean(),
      label: z.string(), // Read the full terms and conditions of our waiver {{HERE}}
      sort: z.number(),
      value: z.string(),
    }),
    z.object({
      id: z.string(),
      isVisible: z.boolean(),
      label: z.string(), // I accept the terms and conditions of the waiver
      sort: z.number(),
      value: z.string(),
    }),
  ).parse(options);
}

onBeforeMount(() => {
  validateOptions();
  if (!selected.value) {
    const waiverSection = useFormNavigationStore().getSectionByUniqueName(ExcelSectionNames.waiver);
    if (!isOnward) {
      waiverSection.disableButton();
    }
  }
});

watch(
  selected,
  (newValue) => {
    const waiverSection = useFormNavigationStore().getSectionByUniqueName(ExcelSectionNames.waiver);
    newValue || isOnward ? waiverSection.enableButton() : waiverSection.disableButton();
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.waiverWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  .headline {
    text-align: left;
    font-family: NexaRegular, sans-serif;
    font-size: 20px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #012f5d;

    .button_popup {
      color: #00a9e4;
      cursor: pointer;
    }

    &.onward {
      font-size: 14px;
      color: $onward-orange;
      font-weight: bold;
      cursor: pointer;

      .button_popup {
        color: $onward-orange;
      }
    }
  }

  .checkbox {
    margin-top: 20px;
  }
}
</style>
