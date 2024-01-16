<template>
  <label :class="labelClasses" v-html="processedLabel"> </label>
</template>
<script lang="ts" setup>
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';

const props = defineProps<{ input: BasicInput }>();

const top = computed(() => {
  if (props.input.label.length > 160) {
    return '-30px';
  } else {
    return '-15px';
  }
});

const isRequired = computed(() => useCommonComponentLogic().isInputRequired(props.input));
const labelClasses = computed(() => [
  'label',
  {
    requiredInputLabel: isRequired.value,
  },
]);

const processedLabel = computed(() => {
  return props.input.label.replaceAll(/\\\\n/g, '<br />');
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.label {
  position: static;
  font-size: 10px;
  color: $dark-gray;
  text-align: left;
  word-break: break-word;
  margin-bottom: 4px;
}
</style>
