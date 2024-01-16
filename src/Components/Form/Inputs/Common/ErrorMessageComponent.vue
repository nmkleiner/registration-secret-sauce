<template>
  <span class="error" v-text="text"></span>
</template>
<script lang="ts" setup>
const props = defineProps<{ text?: string }>();
</script>

<style lang="scss">
@import 'src/assets/style/abstract/colors';

.error {
  position: absolute;
  line-height: initial;
  width: fit-content;
  font-size: 10px;
  text-align: left;
  color: $lipstick;
  bottom: -4px;
  left: 0;
  transform: translateY(100%);
}
</style>
