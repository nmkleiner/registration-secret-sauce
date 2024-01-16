<template>
  <div class="inputContainer">
    <div class="inputWrapper">
      <input
        :id="String(index)"
        class="inputDigit"
        v-for="index in passwordIndexes"
        v-model="userEnteredDigits[index]"
        type="number"
        data-maska="#"
        maxlength="1"
        @input="handleInput($event, index)"
        @click="resetErrorMessage"
        @paste.prevent="handlePaste"
      />
    </div>
    <div v-show="errorMessage" class="error" v-text="errorMessage"></div>
  </div>
</template>
<script setup lang="ts">
import { InsertFormPaste } from '@/Core/Constants/event-input-type.constant';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useLogin } from '@/Core/Composables/login/useLogin';
import { get } from 'lodash-es';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { useCountryStore } from '@/Modules/Common/Stores/Country/country.store';

const userStore = useUserStore();
const passwordIndexes = [0, 1, 2, 3, 4];
const emit = defineEmits<{
  (e: 'backStep'): void;
  (e: 'nextStep'): void;
  (e: 'setValidCode'): void;
  (e: 'setProgress', value: number): void;
}>();
const userEnteredDigits: string[] = reactive([]);
const errorMessage = ref('');
const loadingStatus = ref(0);

onMounted(() => {
  emit('setProgress', 0);
});

async function sendCode() {
  const code = userEnteredDigits.join('').trim();
  if (code.length < 5) {
    return;
  }
  loadingStatus.value = 190;
  emit('setProgress', 80);

  try {
    const response = await userStore.loginRequest(code);

    if (!response.is_success) {
      emit('setProgress', 0);
      errorMessage.value = response.error_text;
      emit('setValidCode');
      return;
    }

    const jwt = response.data.jwt;
    const contactId = response.data.contact_id;

    if (await isNeedToDisplayQuestionsPopup(jwt, response)) {
      return;
    }

    emit('setProgress', 100);
    //Wait for the progress bar to finish
    setTimeout(() => {}, 1000);
    await useLogin().handleLoginSuccess({ jwt, contactId });
  } catch (err) {
    emit('setProgress', 0);
    errorMessage.value = get(err, 'message');
    emit('setValidCode');
  }
}

async function isNeedToDisplayQuestionsPopup(jwt: string, response) {
  if (!useProduct().isOnward.value) {
    return false;
  }

  const askControlQuestion = response.data.ask_control_question;
  const onwardCreatedDate = response.data.onward_active_application_created_date;

  const isDisplay = await useUserStore().returningApplicantForm.isDisplayReturningApplicantPopup(
    askControlQuestion,
    onwardCreatedDate,
  );

  if (isDisplay) {
    useLogin().setJwtToCookies(jwt);
    emit('nextStep');
    useUserStore().returningApplicantForm.initLoginFields(
      response.data.application_id,
      onwardCreatedDate,
      useCountryStore().returningApplicantTranslation,
    );
    return true;
  }
  return false;
}

function resetErrorMessage() {
  errorMessage.value = '';
}

function isDigit(key: string): boolean {
  return !Number.isNaN(parseInt(key));
}

function focusInput(index: number): void {
  document.getElementById(String(index))?.focus();
}

async function handleInput(event: InputEvent, index: number) {
  if (event.inputType === InsertFormPaste) {
    return;
  }

  errorMessage.value = '';
  const input = (event.target as HTMLInputElement).value;
  if (!input) {
    // move focus to previous input
    focusInput(index - 1);
    return;
  }

  if (input.length > 1) {
    await handleMultiDigitInput(input);
    await sendCode();
    return;
  }

  if (isDigit(input)) {
    // move focus to next input, send code to server if full
    focusInput(index + 1);
    await sendCode();
  }
}

function goBackEmail() {
  emit('backStep');
}

async function handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData;
  const pastedData: string[] = clipboardData.getData('Text').split('');

  fillInputs(pastedData);
  await sendCode();
}

async function handleMultiDigitInput(input: string) {
  const pastedData = input.split('');
  fillInputs(pastedData);
}

function fillInputs(pastedData: string[]) {
  userEnteredDigits.splice(0);
  pastedData.forEach((element, index) => {
    if (index < passwordIndexes.length) {
      userEnteredDigits.push(element);
    }
  });
  focusInput(userEnteredDigits.length - 1);
}
</script>

<style scoped lang="scss">
.inputContainer {
  display: flex;
  flex-direction: column;

  .inputWrapper {
    display: flex;
    gap: 10px;
    font-size: 14px;
    text-align: center;
    margin: 10px auto;

    .inputDigit {
      background-color: #eef2f4;
      width: 45px;
      height: 45px;
      border: 1px solid #eef2f4;
      border-radius: 6px;
      padding: 0.94em 16px;
      color: black;
      line-height: 1;

      &:focus {
        color: #00beed;
        border-color: #00beed;
      }
    }
  }

  .error {
    margin-top: -22px;
    margin-bottom: 14px;
    position: unset;
    font-size: 10px;
    letter-spacing: 0.4px;
    background-color: rgba(220, 101, 101, 0.1);
    color: #dc6565;
    padding: 7px 10px;
    line-height: 1.3;
    border-radius: 6px;
  }
}
</style>
