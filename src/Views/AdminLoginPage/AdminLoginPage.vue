<template>
  <div class="adminPage">
    <div class="authPanel">
      <form @submit="onSubmit">
        <div class="container">
          <div class="title">
            <span v-text="$t('excelLoginPage.loginPanel.adminLogin')"></span>
            <div class="line"></div>
          </div>
          <TextField :input="emailInput" />
          <TextField :input="passwordInput" />
          <div v-if="errorMessage" class="error" v-text="errorMessage"></div>
          <Button
            data-qa-id="submit"
            primary
            :text="$t('excelLoginPage.loginPanel.login')"
            type="submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useLogin } from '@/Core/Composables/login/useLogin';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import {
  adminLoginLocalStateCreator,
  loginLocalStateCreator,
} from '@/Modules/Excel/Creators/Login/local-state.creator';

const userStore = useUserStore();

const emailInput = ref<BasicInput>();
emailInput.value = loginLocalStateCreator();
const passwordInput = ref<BasicInput>();
passwordInput.value = adminLoginLocalStateCreator();

const errorMessage = ref('');

async function onSubmit(event: Event) {
  event.preventDefault();
  errorMessage.value = '';
  userStore.setEmail(emailInput.value.value);

  const response = await userStore.loginRequest(passwordInput.value.value);

  if (!response.is_success) {
    useModalsStore().closeModal(ModalNames.error);
    errorMessage.value = response.error_text;
    return;
  }

  const jwt = response.data.jwt;
  const contactId = response.data.contact_id;

  await useLogin().handleLoginSuccess({ jwt, contactId });
}
</script>
<style lang="scss" src="./AdminLoginPage.scss" scoped></style>
