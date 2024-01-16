<template>
  <div class="errorModalWrapper">
    <div class="generalErrorMessage">
      <p>{{ $t('error.fileSizeMessage', { maxFileSize }) }}</p>
    </div>
    <Button :text="$t('editProfile.close')" data-qa-id="close" secondary @click="closeModal" />
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store.js';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface.js';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';

const maxFileSize = computed(() => useApplicationStore().maxFileSize);

const closeModal = (): void => {
  useModalsStore().closeModal(ModalNames.maxFileSizeError);
};
</script>

<style lang="scss" src="../errorModal.scss"></style>
