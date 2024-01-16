import { ModalNames } from './modals-state.interface';
import { Ref } from 'vue';

const modalRefs: Ref<
  Record<ModalNames, { ref: HTMLDialogElement; isOpen: boolean; isPopUp?: boolean; data?: any }>
> = ref({
  [ModalNames.error]: { ref: null, isOpen: false },
  [ModalNames.waiver]: { ref: null, isOpen: false },
  [ModalNames.internship]: { ref: null, isOpen: false },
  [ModalNames.editProfile]: { ref: null, isOpen: false },
  [ModalNames.pleaseWait]: { ref: null, isOpen: false },
  [ModalNames.underMinAge]: { ref: null, isOpen: false },
  [ModalNames.profilePicture]: { ref: null, isOpen: false },
  [ModalNames.imageFileType]: { ref: null, isOpen: false },
  [ModalNames.maxFileSizeError]: { ref: null, isOpen: false },
  [ModalNames.unavailableSeason]: { ref: null, isOpen: false },
  [ModalNames.permissionsAgreement]: { ref: null, isOpen: false },
  [ModalNames.uploadWaitFileModal]: { ref: null, isOpen: false, isPopUp: true },
  [ModalNames.invalidPhoneNumber]: { ref: null, isOpen: false },
  [ModalNames.passportScanModal]: { ref: null, isOpen: false, data: null },
  [ModalNames.submitErrorModal]: { ref: null, isOpen: false },
  [ModalNames.myProgramsModal]: { ref: null, isOpen: false, data: null },
});

export function useModalsStore() {
  function openModal(modal: ModalNames, data: any = null) {
    console.info('openModal', modal, modalRefs.value);
    const modalData = modalRefs.value[modal];
    modalData.ref.close(); // this prevents some crashes
    modalData.isOpen = true;
    modalData.data = data;

    if (modalData.isPopUp) {
      modalData.ref.show();
    } else {
      modalData.ref.showModal();
      document.querySelector('body').style.overflow = 'hidden';
    }
  }

  function closeModal(modal: ModalNames) {
    console.info('closeModal', modal, modalRefs.value);
    modalRefs.value[modal].ref.close();
    modalRefs.value[modal].isOpen = false;
    document.querySelector('body').style.overflow = 'auto';
  }

  return {
    modalRefs,
    openModal,
    closeModal,
  };
}
