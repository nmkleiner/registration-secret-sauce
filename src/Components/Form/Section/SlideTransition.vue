<template>
  <Transition>
    <slot></slot>
  </Transition>
</template>

<script lang="ts"></script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.8s ease;
}

.v-enter-to,
.v-leave-from {
  max-height: 1300px;
  overflow: hidden;
}

.v-enter-from,
.v-leave-to {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
}
</style>
