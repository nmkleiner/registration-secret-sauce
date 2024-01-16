<template>
  <component :is="productComponent" :input="input" />
</template>
<script lang="ts" setup>
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import Dropdown from '@/Modules/Common/Components/Form/Inputs/Dropdown/Dropdown.vue';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';
import CheckboxGroup from '@/Modules/Common/Components/Form/Inputs/Checkboxes/CheckboxGroup.vue';

const props = defineProps<{ input: InputWithMultiSelect }>();

const productComponent = (() => {
  if (props.input.options.length <= 1) {
    return CheckboxGroup;
  }

  const product = useProduct().product.value;

  switch (product) {
    case TaglitProduct.EXCEL:
      return CheckboxGroup;
    case TaglitProduct.ONWARD:
      return Dropdown;
  }
})();
</script>

<style scoped lang="scss"></style>
