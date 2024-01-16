<template>
  <div class="container">
    <span class="title">
      {{ $t('excelLoginPage.loginPanel.checkEmail') }}
      <div class="email">{{ userStore.contactInformation.email }}</div>
      <a
        href="https://www.1secmail.com/?login=compie&domain=1secmail.com"
        target="_blank"
        v-if="displayShortcut"
        >1secmail</a
      >
    </span>
    <VerificationInputs
      @backStep="() => emit('backStep')"
      @nextStep="() => emit('nextStep')"
      @setValidCode="() => emit('setValidCode')"
      @setProgress="(value) => emit('setProgress', value)"
    />
    <div class="footer">
      <Button
        data-qa-id="goBack"
        class="button footer-left"
        @click="goBackEmail"
        :text="$t('excelLoginPage.loginPanel.back')"
        text-only
      />
      <Button
        data-qa-id="sendTempCodeAgain"
        @click="sendTempCodeAgain"
        class="button footer-right"
        :text="$t('excelLoginPage.loginPanel.codeButton')"
        text-only
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import AppConfig from '@/Core/Infrastructure/Config/AppConfig';
import VerificationInputs from '@/Modules/Common/Components/AuthPage/LoginPanel/LoginOptions/LoginWithEmail/LoginVerificationCode/VerificationInputs.vue';

const userStore = useUserStore();
const emit = defineEmits<{
  (e: 'backStep'): void;
  (e: 'nextStep'): void;
  (e: 'setValidCode'): void;
  (e: 'setProgress', value: number): void;
}>();

onMounted(() => {
  emit('setProgress', 0);
});

function goBackEmail() {
  emit('backStep');
}

async function sendTempCodeAgain() {
  try {
    emit('setProgress', 100);
    await useUserStore().sendTempCode(userStore.contactInformation.email);
  } catch (e) {
    emit('setValidCode');
  }
  emit('setProgress', 0);
}

const displayShortcut = computed(() => AppConfig.environment !== 'production');
</script>

<style scoped lang="scss" src="./loginVerificationCode.scss"></style>
