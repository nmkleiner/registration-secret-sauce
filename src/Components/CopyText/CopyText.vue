<template>
  <span class="copyText" v-text="text" @click="copy"></span>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const props = defineProps<{ text: string }>();

const copy = () => useClipboard({ source: props.text, legacy: true }).copy(props.text);
</script>

<style scoped lang="scss">
.copyText {
  cursor: pointer;
}
</style>
