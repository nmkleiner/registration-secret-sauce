<template>
  <div class="theHeaderMenu">
    <div class="pointer" @click="toggleMenu">
      <span class="label" v-text="hiText"> </span>
      <FontAwesomeIcon icon="fa-light fa-chevron-down" :class="iconClasses" />
    </div>

    <div class="menu" v-show="isOpen">
      <div class="userDetails">
        <span class="detail" v-text="fullName"></span>
        <span class="detail" v-text="contactInformation.email"></span>
      </div>
      <div class="menuItems pointer">
        <span
          class="uppercase"
          v-if="showMyProfile"
          v-text="t('header.myProfile')"
          @click="goToMyProfile"
        ></span>
        <span
          class="uppercase"
          v-if="showCompleteApplication"
          v-text="t('header.completeApplication')"
          @click="goToCompleteApplication"
        ></span>
        <span class="uppercase" v-text="t('header.logout')" @click="logout"></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useHeaderMenu } from '@/Core/Composables/mobileDesktopCommonLogic/useHeaderMenu';

const { t } = useI18n();

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

const iconClasses = computed(() => ({
  rotate: isOpen.value,
}));

const hiText = computed(() =>
  `${t('header.hello')}, ${contactInformation.value.firstName}`.toUpperCase(),
);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.theHeaderMenu {
  position: relative;

  .label {
    margin-right: 8px;
  }

  svg {
    transition: transform 0.3s ease-in-out;
  }

  .menu {
    position: absolute;
    right: 0;
    top: 24px;
    width: 240px;
    padding: 16px 0 0;
    border: solid 1px rgba(1, 47, 93, 0.34);
    border-radius: 6px;
    background-color: $white;
    color: $dark-blue;

    .userDetails {
      padding: 0 16px 16px;
      text-align: left;
      display: flex;
      flex-direction: column;
      border-bottom: solid 1px rgba(1, 47, 93, 0.34);

      .detail {
        font-size: 14px;
        font-family: NexaRegular, sans-serif;
        word-break: break-word;
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
