<template>
  <div class="errorModalWrapper">
    <div class="generalErrorMessage">
      <span class="text" v-html="$t('error.unavailableSeasonError')"></span>
    </div>
    <Button :text="$t('editProfile.close')" data-qa-id="close" secondary @click="closeModal" />
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store.js';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface.js';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';

const closeModal = (): void => {
  useModalsStore().closeModal(ModalNames.unavailableSeason);
};
</script>

<style lang="scss" src="../errorModal.scss"></style>
