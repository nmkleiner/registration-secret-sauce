<template>
  <div class="theHeader">
    <TheLogo />

    <TheHeaderMenu />
  </div>
</template>
<script lang="ts" setup>
import TheHeaderMenu from '@/Modules/Common/Components/Header/TheHeaderMenu/TheHeaderMenu.vue';
import TheLogo from '@/Modules/Common/Components/Header/TheLogo.vue';
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

// theHeader should be on top of the page
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

  @include desktop-only {
    padding: 10px 30px;
    height: 100px;
  }
}
</style>
