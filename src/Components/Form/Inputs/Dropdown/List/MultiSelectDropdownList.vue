<template>
  <div class="dropdownList" @click.stop>
    <div class="option" v-for="option in visibleOptions" :key="option.id">
      <Checkbox
        :option="option"
        :group="input"
        :selected="input.isSelected(option.value)"
        @select="emit('multiSelect')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getProductColor } from '@/Core/Constants/product-style.constants';
import Checkbox from '@/Modules/Common/Components/Form/Inputs/Checkboxes/Checkbox.vue';
import { CheckboxOption } from '@/Modules/Common/Entities/Options/checkbox-option';
import { InputWithMultiSelect } from '@/Modules/Common/Entities/FormElements';

const props = defineProps<{ input: InputWithMultiSelect; options: CheckboxOption[] }>();
const emit = defineEmits(['multiSelect']);

const visibleOptions = computed(() => props.options.filter((option) => option.isVisible));

const productColor = getProductColor();
</script>

<style scoped lang="scss">
@import 'DropdownList';

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: v-bind(productColor);
}
</style>
