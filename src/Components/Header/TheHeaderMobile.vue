<template>
  <div class="headerWrapper" v-if="isMenuOpen"></div>
  <div class="theHeader">
    <TheLogo />

    <TheHeaderMenuMobile @menuOpen="menuOpen" />
  </div>
</template>
<script lang="ts" setup>
import TheHeaderMenuMobile from './TheHeaderMenu/TheHeaderMenuMobile.vue';
import TheLogo from '@/Modules/Common/Components/Header/TheLogo.vue';

const isMenuOpen = ref<boolean>(false);
const menuOpen = (isOpen) => (isMenuOpen.value = isOpen);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.headerWrapper {
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: $dark-blue;
  opacity: 0.4;
  z-index: 1;
}

.theHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 81px;
  background-color: $white;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: $blue-azure-opacity solid 1px;
  padding: 15px 30px;
}
</style>
