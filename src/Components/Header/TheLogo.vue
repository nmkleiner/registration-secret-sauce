<template>
  <img class="productLogo" v-if="whiteLogo" :src="whiteLogoSrc" />
  <img class="productLogo" v-else :src="logoSrc" />
</template>
<script setup lang="ts">
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';

withDefaults(defineProps<{ whiteLogo?: boolean }>(), { whiteLogo: false });

const product = useProduct().product.value;
const whiteLogoSrc = computed(() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return '/Excel/logo-white.svg';
    case TaglitProduct.ONWARD:
      return '/Onward/logo-white.png';
  }
});
const logoSrc = computed(() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return '/Excel/logo.jpg';
    case TaglitProduct.ONWARD:
      return '/Onward/logo.png';
  }
});
</script>

<style lang="scss">
@import 'src/assets/style/abstract/breakpoints';

.productLogo {
  width: 160px;

  @include phone {
    width: 90px;
  }
}
</style>
