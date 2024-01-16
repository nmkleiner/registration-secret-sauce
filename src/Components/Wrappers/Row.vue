<template>
  <div class="row">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup></script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.row {
  display: flex;
  justify-content: center;
}
</style>
