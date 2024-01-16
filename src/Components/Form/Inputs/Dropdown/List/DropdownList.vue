<template>
  <div class="dropdownList">
    <div
      class="option pointer"
      v-for="option in visibleOptions"
      :key="option.id"
      :data-qa-id="input.uniqueName + '-' + option.sort"
      @click.stop="() => onSelect(option)"
    >
      <span v-text="option.label"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Option } from '@/Modules/Common/Entities/Options/option';
import { getProductColor } from '@/Core/Constants/product-style.constants';
import { InputWithOptions } from '@/Modules/Common/Entities/FormElements';

const props = defineProps<{ options: Option[]; input: InputWithOptions }>();
const emit = defineEmits<{ (e: 'select', value: Option) }>();
const onSelect = (option: Option) => emit('select', option);

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
