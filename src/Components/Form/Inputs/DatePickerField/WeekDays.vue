<template>
  <div class="weekDays">
    <div class="cell" v-for="day in dayLabels" v-text="day"></div>
  </div>
</template>
<script setup lang="ts">
const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'cell';

.weekDays {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  .cell {
    height: 32px;
  }
}
</style>
