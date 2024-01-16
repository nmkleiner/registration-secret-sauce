<template>
  <div :class="classNameAndProduct(['checkbox', { readonly: props.group.readonly }])">
    <label class="checkboxLabel" :for="option.id" @click.stop="select">
      <input
        type="checkbox"
        :data-qa-id="group.uniqueName + '-' + option.sort"
        :checked="checked"
        :id="getCheckboxId(option.id)"
      />
      <span class="customCheckbox" />
      <span :class="['label', { checked }]" v-text="option.label"></span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import { CheckboxOption } from '@/Modules/Common/Entities/Options/checkbox-option';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';

const { classNameAndProduct } = useGenerateNameStyle();
const { getCheckboxId } = useCommonComponentLogic();

const props = defineProps<{
  option: CheckboxOption;
  group: InputWithMultiSelect;
}>();
const emit = defineEmits(['select']);

const checked = ref(false);
const select = () => {
  if (props.group.readonly) {
    return;
  }

  checked.value = !checked.value;

  checked.value
    ? props.group.optionSelected(props.option)
    : props.group.optionDeselected(props.option);

  props.group.updateSelectedOptions(props.option.value);
  emit('select');
};

onBeforeMount(() => {
  checked.value = props.group.isSelected(props.option.value);
});

const labelColor = (() => {
  switch (useProduct().product.value) {
    case TaglitProduct.ONWARD:
      return '#00154a';
    case TaglitProduct.EXCEL:
      return '#515e59';
  }
})();
</script>
<style scoped lang="scss">
@import 'Checkbox.scss';

.checkbox {
  .label {
    color: v-bind(labelColor);
  }
}
</style>
