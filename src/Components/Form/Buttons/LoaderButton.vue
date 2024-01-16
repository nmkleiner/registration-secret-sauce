<template>
  <Button v-bind="props">
    <template #beforeText>
      <div class="loader" v-if="loading"></div>
    </template>
  </Button>
</template>
<script setup lang="ts">
import Button from './Button.vue';
import { ButtonProps } from '@/Modules/Common/Components/Form/Buttons/button-props';

const props = withDefaults(defineProps<ButtonProps & { loading: boolean }>(), {
  text: '',
  primary: false,
  secondary: false,
  textOnly: false,
  disabled: false,
});
</script>

<style scoped lang="scss">
.loader {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
  border-top: 0.2em solid currentcolor;
  border-right: 0.2em solid transparent;
  animation: loader 1s linear infinite;
  border-radius: 100%;
  position: relative;
  margin-right: 10px;
}

@keyframes loader {
  to {
    transform: rotate(360deg);
  }
}
</style>
