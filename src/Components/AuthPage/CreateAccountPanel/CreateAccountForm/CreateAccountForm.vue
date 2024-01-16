<template>
  <Form class="createAccountFormWrapper" @submit="checkDetails">
    <div class="inputsWrapper">
      <DynamicInput v-for="input in inputs" :key="input.id" :input="input" />
    </div>

    <div class="errorWrapper">
      <ErrorMessageComponent :text="errorMessage" />
    </div>

    <div :class="formButtonsClass">
      <LoaderButton
        data-qa-id="next"
        :text="$t('excelLoginPage.loginPanel.next')"
        :loading="loading"
        primary
      />
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form } from 'vee-validate';
import DynamicInput from '@/Modules/Common/Components/Form/Inputs/DynamicInput.vue';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import {
  CheckDetailsResponse,
  SendTempCodeResponse,
} from '@/Modules/Common/API/AuthApi/auth-api.interfaces';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { ExcelCreateAccountInputs } from '@/Modules/Excel/Enums/excel-create-account.inputs';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { useDropdownOptionsStore } from '@/Modules/Common/Stores/DropdownOptions/dropdown-options.store';
import { OnwardCreateAccountInputs } from '@/Modules/Onward/Enums/onward-create-account.inputs';
import { useProduct } from '@/Core/Composables/program/useProduct';
import LoaderButton from '@/Modules/Common/Components/Form/Buttons/LoaderButton.vue';
import { useUserAgeValidation } from '@/Modules/Common/Composables/use-birth-date-validation';
import { useLoginErrors } from '@/Core/Composables/login/useLoginErrors';
import { PhoneInput } from '@/Modules/Common/Entities/FormElements/phone-input';

const props = defineProps<{
  inputs: BasicInput[];
}>();
const emit = defineEmits(['backStep', 'nextStep', 'handleEmailExist']);
const userStore = useUserStore();
const formButtonsClass = computed(() => {
  return [
    'row formButtons',
    {
      hasError: errorMessage.value,
    },
  ];
});

const {
  setError,
  errorMessage,
  responseHasError,
  emailExistDefaultMessage,
  sendTempCodeDefaultMessage,
} = useLoginErrors();

const loading = ref<boolean>(false);

async function checkDetails(): Promise<void> {
  loading.value = true;
  try {
    const checkDetailsResponse: CheckDetailsResponse = await useUserStore().checkDetailsRequest(
      props.inputs,
    );
    if (checkDetailsResponse?.is_success) {
      loading.value = false;
      emit('nextStep');
    } else {
      if (useProduct().isOnward.value && (checkDetailsResponse.error_id === '6' || checkDetailsResponse.error_id === '81')) {
        await handleEmailExistOnward();
        return;
      }
      setError(checkDetailsResponse.error_text || checkDetailsResponse.message);
    }
  } catch (e) {
    loading.value = false;
    setError(e?.error_text || e?.message);
    console.log(e);
  }
}

const countryInputValue = computed((): string => {
  const countryInput = props.inputs.find((input) =>
    (
      [
        ExcelCreateAccountInputs.MAILING_COUNTRY_CODE,
        OnwardCreateAccountInputs.MAILING_COUNTRY_CODE,
      ] as string[]
    ).includes(input.id),
  );
  if (countryInput) {
    return countryInput.value;
  }
});
const phoneInput = computed(() => {
  const phoneInput = props.inputs.find((input) =>
    (
      [ExcelCreateAccountInputs.PHONE_NUMBER, OnwardCreateAccountInputs.PHONE_NUMBER] as string[]
    ).includes(input.id),
  );
  if (phoneInput) {
    return phoneInput;
  }
});

function updatePhonePrefixByCountry(selectedCountryCode: string) {
  if (!selectedCountryCode) {
    return;
  }

  const selectedCountry = useDropdownOptionsStore().dbOptions.countries?.find(
    (country) => country.isoCode === selectedCountryCode,
  );
  if (!selectedCountry || !phoneInput.value) {
    return;
  }
  if (phoneInput.value instanceof PhoneInput) {
    phoneInput.value.countryPrefix = `+${selectedCountry.areaCode}`;
  }

  if (phoneInput.value instanceof PhoneInput) {
    phoneInput.value.updateCountryName(selectedCountry.value);
  }

  setTimeout(() => {
    phoneInput.value.setErrors([]);
  }, 0);
}
watch(countryInputValue, updatePhonePrefixByCountry, { immediate: true });

async function handleEmailExistOnward() {
  const email = props.inputs.find((input) => input.id === OnwardCreateAccountInputs.EMAIL).value;
  const emailExistResponse = await userStore.emailExist(email);

  if (responseHasError(emailExistResponse, emailExistDefaultMessage)) {
    return;
  }

  useUserStore().setEmail(email);

  const sendTempCodeResponse: SendTempCodeResponse = await useUserStore().sendTempCode(email);

  loading.value = false;
  emit('handleEmailExist');

  if (responseHasError(sendTempCodeResponse, sendTempCodeDefaultMessage)) {
    return;
  }
}

const { hasAgeWarning, handleBirthDateSelected } = useUserAgeValidation();
provide('updateDateSelected', handleBirthDateSelected);
provide('hasAgeWarning', hasAgeWarning);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';

.createAccountFormWrapper {
  .inputsWrapper {
    margin-top: 24px;

    .column {
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: unset;
      }
    }
  }
  .errorWrapper {
    margin-top: 10px;

    .error {
      position: unset;
    }
  }
}
.formButtons {
  justify-content: center;
  margin: 25px 0 10px 0;

  @include phone {
    .button {
      width: calc(100% - 20px);
      text-transform: uppercase;
    }
  }

  &.hasError {
    margin-top: 5px;
  }
}
</style>
