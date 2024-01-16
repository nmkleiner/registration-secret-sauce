<template>
  <div :class="classNameAndProduct(['radioButtons'])">
    <Title :required="isRequired" :title="input.label" small />
    <div class="grid">
      <RadioButton
        v-for="option in input.options"
        :key="option.id"
        :group="input"
        :option="option"
        :selected="selectedOption === option.value"
        v-model:selectedOption="selectedOption"
      />
    </div>
    <ErrorMessageComponent :text="errorMessage" />
  </div>
</template>
<script lang="ts" setup>
import { useField } from 'vee-validate';
import Title from '@/Modules/Common/Components/Form/Inputs/Title/Title.vue';
import { InputWithOptions } from '@/Modules/Common/Entities/FormElements';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import RadioButton from '@/Modules/Common/Components/Form/Inputs/RadioButtons/RadioButton.vue';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';

const props = defineProps<{ input: InputWithOptions }>();

const nameRef = toRef(props.input, 'id');
const { errorMessage, value: selectedOption } = useField(nameRef, props.input.rules, {
  initialValue: props.input.value,
  label: props.input.label,
});

const { handleOptionSelected } = useCommonComponentLogic();
const isRequired = computed(() => useCommonComponentLogic().isInputRequired(props.input));
const { classNameAndProduct } = useGenerateNameStyle();

watch(selectedOption, (newOptionValue) => {
  props.input.value = newOptionValue;
  handleOptionSelected(newOptionValue, props.input);
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.radioButtons {
  position: relative;
  width: 100%;

  .title {
    font-size: 16px;
    color: $dark-gray;
    margin-bottom: 20px;
  }

  .grid {
    display: flex;
    align-items: center;
  }

  &.onward {
    .title {
      font-size: 14px;
    }
  }
}
</style>
