<template>
  <div :class="classNameAndProduct(['checkbox', { readonly }])">
    <label class="checkboxLabel" :for="option.id" @click="select">
      <input
        type="checkbox"
        :data-qa-id="group.uniqueName"
        :checked="selected || checked"
        :id="getCheckboxId(option.id)"
      />
      <span :class="['customCheckbox', { checked }]" />
      <span :class="['label', { checked }]" v-text="option.label"></span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { useField } from 'vee-validate';
import { CheckboxOption } from '@/Modules/Common/Entities/Options/checkbox-option';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import { MedicalDiagnosis } from '@/Modules/Common/Entities/FormElements/medical-diagnosis';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';

const props = withDefaults(
  defineProps<{
    option: CheckboxOption;
    group: InputWithMultiSelect;
    selected?: boolean;
    isBooleanValue?: boolean;
  }>(),
  { selected: false, isBooleanValue: false },
);

const { id: groupId } = toRefs(props.group);
const { checked, handleChange } = useField(groupId, props.group.rules, {
  type: 'checkbox',
  label: props.group.label,
  checkedValue: props.option.value,
});

const { getCheckboxId } = useCommonComponentLogic();
const readonly = computed(() => props.group.readonly);
const { classNameAndProduct } = useGenerateNameStyle();

const select = () => {
  if (readonly.value) {
    return;
  }

  handleChange(props.option.value);

  checked.value
    ? props.group.optionSelected(props.option)
    : props.group.optionDeselected(props.option);

  const optionValue = props.isBooleanValue ? String(checked.value) : props.option.value;

  props.group.clearSelectedOptions();
  props.group.updateSelectedOptions(optionValue);

  if (props.group instanceof MedicalDiagnosis) {
    props.group.updateCanceledOptions(optionValue);
  }
};

onMounted(() => {
  if (!props.group) {
    return;
  }

  if (props.group.isSelected(props.option.value)) {
    props.group.optionSelected(props.option);
    handleChange(props.option.value);
  }
});

const labelColor = (() => {
  switch (useProduct().product.value) {
    case TaglitProduct.ONWARD:
      return '#00154a';
    case TaglitProduct.EXCEL:
      return '#515e59';
  }
})();

watch(
  () => props.selected,
  (newValue) => {
    console.log('SELECTED', newValue);
  },
);
watch(checked, (newValue) => {
  console.log('CHECKED', newValue);
  console.log('value', props.group.value);
});
</script>
<style scoped lang="scss">
@import 'Checkbox.scss';

.checkbox {
  .label {
    color: v-bind(labelColor);
  }
}
</style>
