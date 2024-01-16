<template>
  <div :class="['waiverModalWrapper', { onward: isOnward }]">
    <div class="header">
      <div class="title" v-show="isMobile" v-text="$t('waiver.modal.title')"></div>
      <div class="closeWrapper" @click="closeModal">
        <FontAwesomeIcon class="close" :icon="['fas', 'x']" />
      </div>
    </div>
    <div class="content" v-html="waiverInput.label"></div>
    <div class="footerAction">
      <Button
        v-if="isOnward"
        data-qa-id="cancel"
        class="btn"
        :text="$t('waiver.modal.cancel')"
        secondary
        @click.prevent="closeModal"
      />

      <Button
        v-else
        data-qa-id="download"
        class="btn"
        :text="$t('waiver.modal.download')"
        primary
        textOnly
        @click.prevent="generatePDF"
      />

      <Button
        :text="isOnward ? $t('waiver.modal.agree') : confirmText"
        data-qa-id="agree"
        primary
        hover
        fill
        @click.prevent="confirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useMobileHandler } from '@/Core/Composables/mobileHandler.ts';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { QuestionTypes } from '@/Modules/Common/Enums/input-types.enum';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import UploadFilesApi from '@/Modules/Common/API/UploadFilesApi/upload-files-api';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';

const { t } = useI18n();
const { isMobile } = useMobileHandler();
const waiverInput = useApplicationStore().formElementsManager.getFormElementByType(
  QuestionTypes.waiver,
);

const confirmText = computed(() => {
  //  replace AND with & in the string
  if (isMobile.value) {
    return t('waiver.modal.understand').replace('AND', '&');
  }

  return t('waiver.modal.understand');
});

const closeModal = () => useModalsStore().closeModal(ModalNames.waiver);

const isOnward = useProduct().isOnward.value;

function getCheckboxOption() {
  switch (useProduct().product.value) {
    case TaglitProduct.EXCEL:
      return waiverInput.options[1];
    case TaglitProduct.ONWARD:
      return waiverInput.options[0];
  }
}

const confirm = () => {
  if (waiverInput.value) {
    closeModal();
    return;
  }
  const checkboxId = useCommonComponentLogic().getCheckboxId(getCheckboxOption().id);
  document.getElementById(checkboxId)?.click();
  closeModal();
};

const generatePDF = async () => {
  const file = await UploadFilesApi.downloadWaiverFile();
  const fileURL = URL.createObjectURL(file);

  const anchorElement = document.createElement('a');
  anchorElement.href = fileURL;
  anchorElement.download = 'waiver_agreement.pdf';
  document.body.appendChild(anchorElement);

  anchorElement.click();
  document.body.removeChild(anchorElement);
  URL.revokeObjectURL(fileURL);
};
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';
@import 'src/assets/style/abstract/colors';

.waiverModalWrapper {
  max-width: 1292px;
  padding: 20px 20px 0;

  @include desktop-only {
    height: 800px;
  }
  @include tablet {
    height: 96vh;
  }
  @include phone {
    width: 100%;
    height: 100vh;
    padding: 0 16px 16px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 72px;

    @include desktop-only {
      align-items: flex-start;
      justify-content: flex-end;
      height: 42px;
    }

    .title {
      color: $dark-blue;
      font-family: NexaBold, sans-serif;
    }

    .closeWrapper {
      cursor: pointer;

      .close {
        font-size: 16px;
        color: $dark-blue;
      }
    }
  }

  .content {
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0 40px;
    height: calc(100% - 42px - 72px - 42px);

    @include phone {
      padding: 30px 26px 60px;
      height: calc(100% - 74px - 72px - 42px);
    }

    &::-webkit-scrollbar {
      width: 3px;
      border-radius: 20px;
      height: 12px; /* horizontal scrollbar height */
      background-color: $white; /* or add it to the track */
    }

    &::-webkit-scrollbar-thumb {
      background-color: $bright-azure;
    }
  }

  .footerAction {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 30px;

    .btn {
      margin: 0 30px;
    }

    @include phone {
      position: fixed;
      bottom: 0;
      left: 0;
      flex-direction: column-reverse;
      background-color: white;
      padding-top: 10px;
      margin-top: 0;

      .btn {
        margin: 10px 0;
      }
    }
  }

  &.onward {
    max-width: 1344px;

    @include desktop-only {
      height: 910px;
    }

    .content {
      ::v-deep(.MsoNormal) {
        text-align: left;
        width: fit-content;
        color: $onward-blue;
      }

      &::-webkit-scrollbar-thumb {
        background-color: $onward-orange;
      }
    }

    .footerAction {
      button {
        &.fill {
          background-color: $onward-orange;
          border: solid 1px $onward-orange;
        }

        &.textOnly {
          color: $onward-orange;
          border: 1px solid;
        }
      }
    }

    @include phone {
      .content {
        height: calc(100% - 42px - 72px - 42px);
      }
      .footerAction {
        flex-direction: row;
        align-items: center;
        margin-top: 16px;
        margin-bottom: 16px;
        gap: 16px;

        button {
          padding: 8px 16px;
          height: 40px;
        }
      }
    }
  }
}
</style>
