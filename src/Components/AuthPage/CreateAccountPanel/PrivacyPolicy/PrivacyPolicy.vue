<template>
  <div class="privacyPolicyWrapper">
    <div class="privacyPolicyContent" @scroll="handleScroll" ref="privacyPolicyContent">
      <HardcodedPrivacyPolicy />
    </div>

    <div class="errorWrapper">
      <ErrorMessageComponent :text="errorMessage" />
    </div>

    <div class="formButtonsWrapper">
      <Button
        class="cancelButton"
        :text="$t('excelLoginPage.createAccountPanel.cancelButton')"
        data-qa-id="cancel"
        @click="backStep"
        text-only
        medium
      />

      <LoaderButton
        data-qa-id="agree"
        :disabled="isAgreeButtonDisabled"
        :loading="loading"
        :text="$t('excelLoginPage.createAccountPanel.agreeButton')"
        @click="createAccount"
        primary
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { CreateAccountResponse } from '@/Modules/Common/API/AuthApi/auth-api.interfaces';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useLogin } from '@/Core/Composables/login/useLogin';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import HardcodedPrivacyPolicy from '@/Modules/Common/Components/AuthPage/CreateAccountPanel/PrivacyPolicy/HardcodedPrivacyPolicy.vue';
import { useMobileHandler } from '@/Core/Composables/mobileHandler';
import LoaderButton from '@/Modules/Common/Components/Form/Buttons/LoaderButton.vue';
import { useUserAgeValidation } from '@/Modules/Common/Composables/use-birth-date-validation';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { getProductColor } from '@/Core/Constants/product-style.constants';
import AppConfig from '@/Core/Infrastructure/Config/AppConfig';

const errorMessage = ref<string>('');
const privacyPolicyContent = ref(null);
const isScrollToBottom = ref<boolean>(false);
const props = defineProps<{
  inputs: BasicInput[];
}>();
const emit = defineEmits(['backStep', 'nextStep', 'setProgress', 'underMinAge']);

const loading = ref<boolean>(false);
const backStep = (): void => emit('backStep');

// const privacyPolicyTranslation = computed(() => useCountryStore().privacyPolicyTranslation);

const handleScroll = ({ target: { scrollTop, clientHeight, scrollHeight } }): void => {
  isScrollToBottom.value = scrollTop + clientHeight >= scrollHeight - 10;
};
const isAgreeButtonDisabled = computed(() => {
  if (useMobileHandler().isMobile.value) {
    return false;
  }
  return !isScrollToBottom.value;
});

const { isOverMaxAge, isBetweenAges, isUnderMinPossibleAgeErrorMsg } = useUserAgeValidation();

const createAccount = async (): Promise<CreateAccountResponse> => {
  loading.value = true;
  try {
    const createAccountResponse: CreateAccountResponse = await useUserStore().createAccountRequest(
      props.inputs,
    );
    loading.value = false;

    if (isOverMaxAge(createAccountResponse.data?.lead_type)) {
      window.location.href = `${AppConfig.baseWebsiteUrl}/other-programs?contactId=${createAccountResponse.data.contact_id}`;
      return;
    }
    if (
      isBetweenAges(createAccountResponse.data?.lead_type) ||
      isUnderMinPossibleAgeErrorMsg(createAccountResponse.error_text)
    ) {
      useModalsStore().openModal(ModalNames.underMinAge);
      emit('underMinAge');
      return;
    }
    if (createAccountResponse?.is_success) {
      const jwt = createAccountResponse.data.jwt;
      const applicationId = createAccountResponse.data.application_id;

      await useLogin().handleCreateAccountSuccess({ jwt, applicationId });
    } else {
      errorMessage.value = createAccountResponse?.error_text || createAccountResponse?.message;
    }
  } catch (e) {
    loading.value = false;
    errorMessage.value = e?.error_text || e?.message;
    console.log(e);
  }
};

onMounted(() => {
  isScrollToBottom.value =
    privacyPolicyContent.value.scrollHeight <= privacyPolicyContent.value.clientHeight;
});

const productColor = getProductColor();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';
@import 'src/assets/style/abstract/colors';

.privacyPolicyWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 30px;
  height: 100%;
  text-align: left;

  .privacyPolicyContent {
    color: #515e59;
    line-height: 1.5;

    @include desktop-only {
      height: calc(100% - 80px);
      overflow: auto;
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: v-bind(productColor);
    }
  }

  .errorWrapper {
    margin-top: 10px;

    .error {
      position: unset;
    }
  }

  .formButtonsWrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 20px;

    @include desktop-only {
      padding-bottom: 0;
    }

    .cancelButton {
      padding: unset;
    }
  }
}
</style>
