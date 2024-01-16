<template>
  <div class="errorModalWrapper">
    <div class="generalErrorMessage">
      <span class="text" v-html="$t('error.generalMessage')"></span>
    </div>
    <Button
      :text="$t('editProfile.close')"
      data-qa-id="close"
      secondary
      hover
      @click="closeModal"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store.js';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface.js';

const closeModal = (): void => {
  useModalsStore().closeModal(ModalNames.error);
};
</script>

<style lang="scss" src="../errorModal.scss"></style>
