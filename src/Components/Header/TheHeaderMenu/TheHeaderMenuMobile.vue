<template>
  <div class="theHeaderMenu">
    <div class="pointer" @click="toggleMenu">
      <FontAwesomeIcon icon="fa-light fa-bars" />
    </div>

    <div class="menu" v-show="isOpen" v-on-click-outside="handleCloseMenu">
      <div class="menuHeader">
        <TheLogo />
        <FontAwesomeIcon icon="fa-light fa-close" class="removeBtn" @click="toggleMenu" />
      </div>
      <div class="userDetails">
        <span class="detail" v-text="fullName"></span>
        <span class="detail" v-text="contactInformation.email"></span>
      </div>
      <div class="menuItems pointer">
        <span
          class="capitalize"
          v-if="showMyProfile"
          v-text="t('header.myProfile')"
          @click="goToMyProfile"
        ></span>
        <span
          class="capitalize"
          v-if="showCompleteApplication"
          v-text="t('header.completeApplication')"
          @click="goToCompleteApplication"
        ></span>
        <span class="capitalize" v-text="t('header.logout')" @click="logout"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import TheLogo from '@/Modules/Common/Components/Header/TheLogo.vue';
import { useI18n } from 'vue-i18n';
import { useHeaderMenu } from '@/Core/Composables/mobileDesktopCommonLogic/useHeaderMenu';

const { t } = useI18n();

const emits = defineEmits(['menuOpen']);

const {
  logout,
  isOpen,
  fullName,
  toggleMenu,
  goToMyProfile,
  showMyProfile,
  contactInformation,
  goToCompleteApplication,
  showCompleteApplication,
} = useHeaderMenu();

function handleCloseMenu() {
  if (isOpen.value) {
    isOpen.value = false;
  }
}

watch(isOpen, () => {
  emits('menuOpen', isOpen.value);
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.theHeaderMenu {
  .label {
    margin-right: 8px;
  }

  svg {
    transition: transform 0.3s ease-in-out;
  }

  .menu {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    border-bottom: solid 1px rgba(1, 47, 93, 0.34);
    background-color: $white;
    color: $dark-blue;

    .menuHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      height: 81px;
      border-bottom: solid 1px rgba(1, 47, 93, 0.34);
    }

    .userDetails {
      padding: 16px;
      line-height: 1.4;
      text-align: left;
      display: flex;
      flex-direction: column;
      border-bottom: solid 1px rgba(1, 47, 93, 0.34);

      .detail {
        width: 206px;
        font-size: 14px;
        font-family: NexaRegular, sans-serif;
      }
    }

    .menuItems {
      display: flex;
      flex-direction: column;
      text-align: left;
      font-family: NexaBold, sans-serif;
      font-size: 14px;
      padding: 16px 0 0;

      span {
        height: 40px;
        padding: 0 16px;
      }
    }
  }
}
</style>
