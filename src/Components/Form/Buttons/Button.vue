<template>
  <button :class="buttonClasses" :disabled="disabled" :data-qa-id="dataQaId">
    <slot name="beforeText"></slot>
    {{ text }}
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { useProduct } from '@/Core/Composables/program/useProduct';
import { ButtonProps } from '@/Modules/Common/Components/Form/Buttons/button-props';
import { getProductFontFamily } from '@/Core/Constants/product-style.constants';

const props = withDefaults(defineProps<ButtonProps>(), {
  text: '',
  primary: false,
  secondary: false,
  textOnly: false,
  disabled: false,
  small: false,
});

const buttonClasses = computed(() => [
  'button',
  {
    primary: props.primary,
    secondary: props.secondary,
    textOnly: props.textOnly,
    disabled: props.disabled,
    small: props.small,
    onward: !props.ignoreProgram && useProduct().isOnward.value,
  },
]);

const fontFamily = getProductFontFamily();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 14px;
  font-family: v-bind(fontFamily);
  cursor: pointer;

  &.primary,
  &.secondary {
    height: 44px;
    padding: 16px 40px;
    border-radius: 22px;
  }

  &.primary {
    background-color: #00a9e4;
    color: white;

    &.onward {
      background-color: $onward-orange;
    }
  }

  &.secondary {
    background-color: transparent;
    border: solid 1px #00a9e4;
    color: #00a9e4;

    &.onward {
      border: solid 1px $onward-orange;
      background-color: #fbfdff;
      color: $onward-orange;
    }
  }

  &.textOnly {
    height: 44px;
    padding: 16px 0;
    background-color: transparent;
    color: #00a9e4;

    &.onward {
      color: $onward-orange;
    }
  }

  &.disabled {
    background-color: #e0e0e0;
    color: $dark-gray;
    cursor: not-allowed;

    &.onward {
      background-color: $bright-gray;
      color: $dark-gray-text;
    }
  }

  &.small {
    height: 26px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
