<template>
  <div class="pleaseWait">
    <div class="text">Loading...</div>
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
import { getProductColor } from '@/Core/Constants/product-style.constants';

const animationColor = getProductColor();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';
@import 'src/assets/style/abstract/colors';

$animationColor: v-bind(animationColor);
.pleaseWait {
  width: 360px;
  height: 300px;
  padding: 100px;

  .text {
    margin-bottom: 40px;
    font-size: 18px;
  }
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  background: #fff;
  box-shadow: -24px 0 #fff, 24px 0 #fff;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #fff;
    box-shadow: -24px 0 $animationColor, 24px 0 #fff;
  }
  66% {
    background: $animationColor;
    box-shadow: -24px 0 #fff, 24px 0 #fff;
  }
  100% {
    background: #fff;
    box-shadow: -24px 0 #fff, 24px 0 $animationColor;
  }
}
</style>
