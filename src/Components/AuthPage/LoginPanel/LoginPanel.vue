<template>
  <div class="panelContainer">
    <div class="panel">
      <transition name="login-email">
        <component
          :is="loginComponent"
          @nextStep="nextStep"
          @backStep="backStep"
          @setProgress="setProgress"
        >
        </component>
      </transition>
    </div>
  </div>
  <ProgressBar :status="progressStatus" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LoginWithEmail from './LoginOptions/LoginWithEmail/LoginWithEmail.vue';
import ProgressBar from '@/Modules/Common/Components/AuthPage/LoginPanel/ProgressBar/ProgressBar.vue';
import LoginVerificationCode from '@/Modules/Common/Components/AuthPage/LoginPanel/LoginOptions/LoginWithEmail/LoginVerificationCode/LoginVerificationCode.vue';
import { AuthTabEnum } from '@/Modules/Common/Enums/auth-tab.enum';
import ReturningApplicantQuestions from '@/Modules/Common/Components/AuthPage/LoginPanel/LoginOptions/LoginWithEmail/LoginVerificationCode/ReturningApplicantQuestions/ReturningApplicantQuestions.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';

const { t } = useI18n();
const props = defineProps<{
  isHandleEmailExist: boolean;
}>();
const emit = defineEmits(['setActiveTab', 'handleEmailExist']);
const step = ref(1);
const progressStatus = ref(0);
const isDisplayReturningApplicantPopup = computed(
  () => useUserStore().returningApplicantForm.isDisplayPopup,
);

const loginComponent = computed(() => {
  if (props.isHandleEmailExist) {
    return LoginVerificationCode;
  }

  if (isDisplayReturningApplicantPopup.value) {
    return ReturningApplicantQuestions;
  }

  switch (step.value) {
    case 1:
      return LoginWithEmail; //UNDO: back to LoginWithEmail
    case 2:
      return LoginVerificationCode;
    case 3:
      return ReturningApplicantQuestions;
  }
});

function nextStep() {
  step.value++;
}

function backStep() {
  if (props.isHandleEmailExist) {
    emit('setActiveTab', AuthTabEnum.CREATE_ACCOUNT);
  }
  step.value--;
}

function setProgress(progress: number) {
  progressStatus.value = progress;
}
</script>
<style lang="scss" scoped src="./loginPanel.scss"></style>
