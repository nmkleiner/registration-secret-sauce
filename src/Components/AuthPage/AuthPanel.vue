<template>
  <div :class="authPanelClass" v-if="isPanelDisplayed">
    <img id="mobileLogo" class="mobileLogo" :src="productLogo" />
    <div class="authTabsWrapper">
      <div
        :class="tabClass(AuthTabEnum.CREATE_ACCOUNT)"
        v-text="createAccountTabLabel"
        @click="selectTab(AuthTabEnum.CREATE_ACCOUNT)"
      ></div>
      <div
        :class="tabClass(AuthTabEnum.LOGIN)"
        v-text="loginTabLabel"
        @click="selectTab(AuthTabEnum.LOGIN)"
      ></div>
    </div>

    <KeepAlive>
      <component
        :is="activeTabComponent"
        :isHandleEmailExist="isHandleEmailExist"
        @handleEmailExist="handleEmailExist"
        @setActiveTab="selectTab"
        @underMinAge="hidePanel"
      />
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { AuthTabEnum } from '@/Modules/Common/Enums/auth-tab.enum';
import LoginPanel from '@/Modules/Common/Components/AuthPage/LoginPanel/LoginPanel.vue';
import CreateAccountPanelExcel from '@/Modules/Excel/Components/ExcelAuth/CreateAccountPanel/CreateAccountPanelExcel.vue';
import CreateAccountPanelOnward from '@/Modules/Onward/Components/OnwardAuth/CreateAccountPanel/CreateAccountPanelOnward.vue';
import { useDropdownOptionsStore } from '@/Modules/Common/Stores/DropdownOptions/dropdown-options.store';
import { useRouter } from 'vue-router';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import { getProductBackgroundTabColor } from '@/Core/Constants/product-style.constants';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';

const { t } = useI18n();
const product = useProduct().product.value;

const tabColor = ref('');

const productLogo = (() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return '/Excel/logo.jpg';
    case TaglitProduct.ONWARD:
      return '/Onward/logo.png';
  }
})();

await useDropdownOptionsStore().fetchCountries();
const activeTab = ref<AuthTabEnum>(
  useProduct().isOnward.value && !useUserStore().returningApplicantForm.isDisplayPopup
    ? AuthTabEnum.CREATE_ACCOUNT
    : AuthTabEnum.LOGIN,
);
const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case AuthTabEnum.CREATE_ACCOUNT:
      return createAccountPanel.value;
    case AuthTabEnum.LOGIN:
      return LoginPanel;
  }
});
const createAccountPanel = computed(() => {
  switch (product) {
    case TaglitProduct.EXCEL:
      return CreateAccountPanelExcel;
    case TaglitProduct.ONWARD:
      return CreateAccountPanelOnward;
  }
});

const createAccountTabLabel = computed((): string => t('excelLoginPage.loginPanel.createAccount'));
const loginTabLabel = computed((): string => t('excelLoginPage.loginPanel.login'));
const tabClass = (tab: AuthTabEnum) => {
  return ['tab', { selected: tab === activeTab.value }];
};
const authPanelClass = computed(() => {
  return [
    'authPanel',
    {
      createAccountPanelOpen: activeTab.value === AuthTabEnum.CREATE_ACCOUNT,
    },
  ];
});

const selectTab = (tab: AuthTabEnum): void => {
  activeTab.value = tab;
};

const isPanelDisplayed = ref(true);
const hidePanel = (): void => {
  isPanelDisplayed.value = false;
};

const router = useRouter();
onBeforeMount(() => {
  const isCreateAccount = router.currentRoute.value.query.auth_tab === 'sign_up';
  const isLogin = router.currentRoute.value.query.auth_tab === 'login';

  if (isCreateAccount) {
    activeTab.value = AuthTabEnum.CREATE_ACCOUNT;
  }

  if (isLogin) {
    activeTab.value = AuthTabEnum.LOGIN;
  }

  tabColor.value = getProductBackgroundTabColor();
});

const isHandleEmailExist = ref(false);
const handleEmailExist = () => {
  selectTab(AuthTabEnum.LOGIN);
  isHandleEmailExist.value = true;
};
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.authPanel {
  width: 100%;
  background-color: #fff;
  position: relative;
  box-shadow: 0 4px 16px 0 rgba(26, 35, 52, 0.12);
  transition: all 0.2s linear;
  overflow: hidden;
  height: 100%;
  padding: 0 20px;

  @include desktop-only {
    padding: 10px 20px;
  }

  .mobileLogo {
    @include desktop-only {
      display: none;
    }
    margin-top: 40px;
    margin-bottom: 20px;
    width: 200px;
  }

  @include desktop-only {
    height: 320px;
  }

  &.createAccountPanelOpen {
    height: fit-content;

    transition: all 0.3s linear;

    @include phone {
      height: unset;
      padding-bottom: 20px;
    }
  }

  .authTabsWrapper {
    margin-bottom: 7px;

    .tab {
      display: inline-block;
      position: relative;
      padding: 15px 0;
      width: 50%;
      text-align: center;
      text-transform: uppercase;
      font-size: 12px;
      color: $dark-blue;
      font-family: NexaRegular, sans-serif;
      cursor: pointer;

      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        height: 1px;
        width: 100%;
        background-color: #b9b9b9;
      }

      &.selected {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: v-bind(tabColor);

        &:after {
          height: 2px;
          bottom: -1px;
          background-image: v-bind(tabColor);
        }
      }
    }
  }

  .container {
    margin-top: 0;
    font-family: NexaRegular, sans-serif;
  }

  //div {
  //  color: #00a0e2;
  //}

  @media screen and (min-width: 769px) {
    width: 380px;
    border-radius: 6px;
  }

  ::v-deep(.progressBarWrapper) {
    left: 0;
  }
}
</style>
