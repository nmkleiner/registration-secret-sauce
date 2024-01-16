<template>
  <div :class="classNameAndProduct(['textField', { readonly: input.readonly }])">
    <InputLabel :input="input" />
    <div class="inputWrapper">
      <span class="prefix" v-if="inputPrefix" v-text="inputPrefix" />
      <div class="icons">
        <slot name="icons" />
      </div>
      <component
        :is="tag"
        :type="inputType"
        :value="value"
        :readonly="isReadonly"
        :class="inputClasses"
        :data-maska="input.mask"
        :name="input.id"
        :data-qa-id="input.uniqueName"
        v-maska
        @input="onInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
    </div>
    <div class="hintWrapper">
      <div class="hint" v-text="input.hint"></div>
      <slot name="message"></slot>
    </div>

    <div class="messageWrapper">
      <ErrorMessageComponent
        :text="message || outsideErrorMessage"
        :columns="input.sectionColumns / input.columns"
        :inputType="input.componentType"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputLabel from '@/Modules/Common/Components/Form/Inputs/Common/InputLabel.vue';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import { getEventValue } from '@/Core/Helpers/get-event-value';
import { QuestionFormat } from '@/Modules/Common/Enums/question-format.enum';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';
import { PhoneInput } from '@/Modules/Common/Entities/FormElements/phone-input';

const props = withDefaults(
  defineProps<{
    input: BasicInput;
    readonly?: boolean;
    type?: string;
    displayHint?: boolean;
    outsideErrorMessage?: string;
  }>(),
  {
    readonly: false,
    displayHint: false,
    outsideErrorMessage: '',
  },
);

const isReadonly = computed(() => props.readonly || props.input.readonly);
const { classNameAndProduct } = useGenerateNameStyle();

const inputPrefix = computed(
  () =>
    props.input instanceof PhoneInput &&
    props.input.displayPhonePrefix &&
    props.input.countryPrefix &&
    `${props.input.countryPrefix} -`,
);

const getInputType = (type: string, questionFormat: QuestionFormat) => {
  if (type) {
    return type;
  }

  switch (questionFormat) {
    case QuestionFormat.email:
      return 'email';
    case QuestionFormat.wholeNumber:
      return 'number';
  }

  return 'text';
};
const inputType = getInputType(props.type, props.input.questionFormat);

const getTag = (type: string) => (type === 'textarea' ? 'textarea' : 'input');
const tag = getTag(props.type);

const inputClasses = computed(() => [
  'input',
  {
    readonly: props.readonly,
    hasPrefix:
      props.input instanceof PhoneInput &&
      props.input.displayPhonePrefix &&
      props.input.countryPrefix,
  },
]);

const nameRef = toRef(props.input, 'id');
const {
  errorMessage: message,
  value,
  setErrors,
} = useField(nameRef, props.input.rules, {
  initialValue: props.input.value,
  label: props.input.label,
});

function setValidationFunctionsInInstance() {
  props.input.setSetErrors(setErrors);
}

setValidationFunctionsInInstance();
const emit = defineEmits(['focus', 'blur']);
const onInput = (event: Event) => (value.value = getEventValue(event));

watch(props.input, (input: BasicInput) => (value.value = input.value));
watch(value, (value) => (props.input.value = value));
</script>

<style scoped lang="scss" src="./TextField.scss"></style>
