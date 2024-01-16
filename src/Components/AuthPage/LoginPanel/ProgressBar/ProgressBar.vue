<template>
  <div class="progressBarWrapper">
    <div class="progressBar" :style="styleObject"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  status: {
    type: Number,
    required: true,
  },
});
const styleObject = computed(() => {
  return {
    width: `${props.status}%`,
    transition: matchTransitionToProcess.value,
  };
});
const matchTransitionToProcess = computed(() => {
  switch (props.status) {
    case 0:
      return 'unset';
    case 100:
      return 'width .10s ease-in-out';
    default:
      return 'width 8s linear';
  }
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';

.progressBarWrapper {
  width: 100%;
  height: 4px;
  bottom: 0;
  overflow: hidden;
  position: fixed;

  @include desktop-only {
    position: absolute;
  }

  .progressBar {
    position: absolute;
    left: 0;
    width: 0;
    height: 4px;
    border-radius: 6px;
    background: linear-gradient(73deg, #00cef3, #00a0e2);
    transition: all 0.2s linear;
  }
}
</style>
