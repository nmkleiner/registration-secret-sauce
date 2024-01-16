<template>
  <div class="authPage">
    <div class="imageContainer">
      <div class="logoWrapper">
        <TheLogo :white-logo="true" />
      </div>
      <div class="contentWrapper">
        <span class="title" v-text="title"></span>
        <span class="subTitle" v-text="subtitle"></span>
      </div>
      <div class="filter"></div>
    </div>
    <div class="authPanelWrapper">
      <component :is="authPanelComponent" />
    </div>
  </div>
</template>
<script setup lang="ts">
import TheLogo from '@/Modules/Common/Components/Header/TheLogo.vue';
import AuthPage from '@/Modules/Common/Components/AuthPage/AuthPanel.vue';
import { translate } from '@/Core/Translations/vue-i18n';
import { useGeoLocation } from '@/Core/Composables/geoLocation/use-geo-location';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';

const product = useProduct().product.value;

const title = computed(() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return translate('excelLoginPage.image.title');
    case TaglitProduct.ONWARD:
      return translate('onwardLoginPage.image.title');
  }
});
const subtitle = computed(() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return translate('excelLoginPage.image.text');
    case TaglitProduct.ONWARD:
      return translate('onwardLoginPage.image.text');
  }
});
// const backgroundImage = computed(() => {
//   switch (product) {
//     case TaglitProduct.EXCEL:
//       return `url('/Excel/login-image2.png')`;
//     case TaglitProduct.ONWARD:
//       return `url('/Onward/login-image.webp')`;
//   }
// });

const authPanelComponent = computed(() => {
  return AuthPage;
});

const { getUserCountryCode } = useGeoLocation();
await getUserCountryCode();
await useUserStore().getCreateAccountData();
useFormNavigationStore().initParams();
useFormNavigationStore().initFullLoginUrl();
</script>
<style lang="scss">
@import 'src/assets/style/abstract/breakpoints';

.authPage {
  display: flex;
  text-align: center;
  justify-content: flex-end;

  .imageContainer {
    display: none;
    width: 0;
    height: 0;
    position: relative;

    @include desktop-only {
      background-image: url('/Onward/login-image.webp');
      background-size: cover;
      background-position: center center;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      width: 480px;
      height: 100vh;
      padding: 0 30px;
      position: fixed;
      left: 0;
      top: 0;
    }

    .logoWrapper {
      margin-top: 40px;
    }

    .container {
      z-index: 2;
      position: absolute;
      bottom: 0;
    }

    .contentWrapper {
      color: white;
      margin-bottom: 140px;
      text-align: left;
      border-radius: 50%;
      line-height: 1;
      font-family: NexaBold, sans-serif;
      display: flex;
      flex-direction: column;
      width: 312px;
      z-index: 2;

      .title {
        margin-bottom: 12px;
        font-size: 32px;
      }

      .subTitle {
        text-align: left;
        max-height: 60px;
        font-family: NexaRegular, sans-serif;
        line-height: 1.5;
      }
    }

    .filter {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 600px;
      background-image: linear-gradient(to bottom, rgba(12, 11, 31, 0), #0c0b1f);
      z-index: 1;
    }
  }

  .authPanelWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: #eef2f4;
    padding: 20px 0;

    @include desktop-only {
      width: calc(100% - 480px);
    }
  }
}
</style>
