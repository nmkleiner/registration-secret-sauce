<template>
  <div class="column">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup></script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
