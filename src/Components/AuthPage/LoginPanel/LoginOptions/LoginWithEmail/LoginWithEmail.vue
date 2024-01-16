<template>
  <div class="container">
    <span class="email-container">
      <Form @submit="submit" class="formContainer">
        <div class="input-container">
          <TextField
            @keydown.enter.prevent="submit"
            :input="emailInput"
            :outsideErrorMessage="errorMessage"
          />
        </div>

        <LoaderButton
          data-qa-id="next"
          :text="$t('excelLoginPage.loginPanel.next')"
          :loading="loading"
          primary
        />
      </Form>
    </span>
  </div>
</template>
<script setup lang="ts">
import { Form } from 'vee-validate';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import { loginLocalStateCreator } from '@/Modules/Excel/Creators/Login/local-state.creator';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { useCountryStore } from '@/Modules/Common/Stores/Country/country.store';
import LoaderButton from '@/Modules/Common/Components/Form/Buttons/LoaderButton.vue';
import { useLoginErrors } from '@/Core/Composables/login/useLoginErrors';
import { SendTempCodeResponse } from '@/Modules/Common/API/AuthApi/auth-api.interfaces';

const emit = defineEmits(['backStep', 'nextStep']);

const userStore = useUserStore();

const loading = ref<boolean>(false);

const {
  resetErrors,
  errorMessage,
  responseHasError,
  emailExistDefaultMessage,
  sendTempCodeDefaultMessage,
} = useLoginErrors();

const emailInput = ref<BasicInput>();
emailInput.value = loginLocalStateCreator();

async function emailExist() {
  const email = emailInput.value.value;

  const emailExistResponse = await userStore.emailExist(email);

  if (responseHasError(emailExistResponse, emailExistDefaultMessage)) {
    return;
  }

  useCountryStore().setExcelCode(emailExistResponse.data?.registration_ISO_code);
  useUserStore().setEmail(email);

  const [sendTempCodeResponse]: [SendTempCodeResponse] = await Promise.all([
    useUserStore().sendTempCode(email),
  ]);

  if (responseHasError(sendTempCodeResponse, sendTempCodeDefaultMessage)) {
    return;
  }

  emit('nextStep');
}

async function submit() {
  resetErrors();
  loading.value = true;
  await emailExist();
  loading.value = false;
}
</script>
<style scoped lang="scss" src="./loginWithEmail.scss"></style>
