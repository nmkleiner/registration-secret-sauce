<template>
  <dialog
    class="appModalsWrapper"
    :class="modal.additionalClass || ''"
    v-for="modal in modals"
    :ref="(el) => (modalRefs[modal.name].ref = el)"
    @keydown.esc="() => closeModal(modal.name)"
    tabindex="0"
  >
    <div class="modalContent">
      <component :is="modal.component" v-if="modalRefs[modal.name].isOpen" />
    </div>
  </dialog>

  <dialog
    class="appModalsWrapper"
    :ref="(el) => (modalRefs[internshipModal.name].ref = el)"
    @keydown.esc="() => closeModal(internshipModal.name)"
    tabindex="0"
  >
    <div class="modalContent">
      <component
        :is="internshipModal.component"
        v-if="!isMobile && modalRefs[internshipModal.name].isOpen"
      />
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { useMobileHandler } from '@/Core/Composables/mobileHandler';

const { isMobile } = useMobileHandler();

const WaiverModal = defineAsyncComponent(
  () => import('@/Modules/Common/Components/Modals/WaiverModal/WaiverModal.vue'),
);
const ErrorModal = defineAsyncComponent(
  () => import('@/Modules/Common/Components/Modals/ErrorModal/ErrorModal.vue'),
);
const MaxFileSizeErrorModal = defineAsyncComponent(
  () =>
    import('@/Modules/Common/Components/Modals/MaxFileSizeErrorModal/MaxFileSizeErrorModal.vue'),
);
const UnavailableSeasonModal = defineAsyncComponent(
  () =>
    import('@/Modules/Common/Components/Modals/UnavailableSeasonModal/UnavailableSeasonModal.vue'),
);
const ImageFileTypeModal = defineAsyncComponent(
  () => import('@/Modules/Common/Components/Modals/ImageFileTypeModal/ImageFileTypeModal.vue'),
);
const ProfilePictureModal = defineAsyncComponent(
  () => import('@/Modules/Excel/Components/Modals/ProfilePictureModal/ProfilePictureModal.vue'),
);
const EditProfileModal = defineAsyncComponent(
  () => import('@/Modules/Excel/Components/Modals/EditProfileModal/EditProfileModal.vue'),
);
const InternshipModal = defineAsyncComponent(
  () => import('@/Modules/Excel/Components/Modals/InternshipModal/InternshipModal.vue'),
);
const PleaseWaitModal = defineAsyncComponent(
  () => import('@/Modules/Common/Components/Modals/PleaseWaitModal/PleaseWaitModal.vue'),
);

const uploadWaitFileModal = defineAsyncComponent(
  () => import('@/Modules/Excel/Components/Modals/UploadWaitFileModal/UploadWaitFileModal.vue'),
);

const InvalidPhoneNumberModal = defineAsyncComponent(
  () =>
    import(
      '@/Modules/Onward/Components/Modals/InvalidPhoneNumberModal/InvalidPhoneNumberModal.vue'
    ),
);

const PassportScanModal = defineAsyncComponent(
  () => import('@/Modules/Onward/Components/Modals/PassportScanModal/PassportScanModal.vue'),
);

const UnderMinAgeModal = defineAsyncComponent(
  () => import('@/Modules/Common/Components/Modals/UnderMinAgeModal/UnderMinAgeModal.vue'),
);

const SubmitErrorModal = defineAsyncComponent(
  () => import('@/Modules/Onward/Components/Modals/SubmitErrorModal/SubmitErrorModal.vue'),
);

const MyProgramsModal = defineAsyncComponent(
  () => import('@/Modules/Onward/Components/Modals/MyProgramsModal/MyProgramsModal.vue'),
);

const partialScreen = 'partialScreen'; // used for modals that are not full screen in mobile
const modals = [
  { name: ModalNames.error, component: ErrorModal, additionalClass: partialScreen },
  { name: ModalNames.waiver, component: WaiverModal },
  {
    name: ModalNames.editProfile,
    component: EditProfileModal,
  },
  {
    name: ModalNames.pleaseWait,
    component: PleaseWaitModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.unavailableSeason,
    component: UnavailableSeasonModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.imageFileType,
    component: ImageFileTypeModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.profilePicture,
    component: ProfilePictureModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.maxFileSizeError,
    component: MaxFileSizeErrorModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.uploadWaitFileModal,
    component: uploadWaitFileModal,
    additionalClass: 'toast',
  },
  {
    name: ModalNames.invalidPhoneNumber,
    component: InvalidPhoneNumberModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.passportScanModal,
    component: PassportScanModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.underMinAge,
    component: UnderMinAgeModal,
    additionalClass: partialScreen + ' panelPosition',
  },
  {
    name: ModalNames.submitErrorModal,
    component: SubmitErrorModal,
    additionalClass: partialScreen,
  },
  {
    name: ModalNames.myProgramsModal,
    component: MyProgramsModal,
    additionalClass: partialScreen,
  },
];
const internshipModal = {
  name: ModalNames.internship,
  component: InternshipModal,
};

const { closeModal, modalRefs } = useModalsStore();
</script>

<style lang="scss">
@import 'modal';

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
