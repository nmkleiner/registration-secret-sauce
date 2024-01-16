<template>
  <div class="baseModalWrapper">
    <div class="authPanel dynamicPanelsWrapper">
      <div class="returningApplicantsForm">
        <p class="popupHeader" v-text="returningApplicantTranslation.header" />
        <Form class="formSelectQuestions">
          <div class="inputsWrapper">
            <DynamicInput v-for="input in inputs" :key="input.id" :input="input" />
          </div>

          <div class="errorWrapper">
            <ErrorMessageComponent :text="errorMessage" />
          </div>
        </Form>

        <div class="termsAndConditions">
          <div v-text="returningApplicantTranslation.beforeWaiverLink"></div>
          <a href="/waiver" target="_blank" v-text="returningApplicantTranslation.waiverLink"></a>
        </div>

        <div class="popupFooter" v-if="isFormFilled" v-text="note" />

        <LoaderButton
          :class="['continueButton', { disabled: !isFormFilled }]"
          :text="returningApplicantTranslation.continue"
          :loading="loading"
          data-qa-id="continue"
          medium
          hover
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DynamicInput from '@/Modules/Common/Components/Form/Inputs/DynamicInput.vue';
import { Form } from 'vee-validate';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import { OnwardReturningApplicantEnum } from '@/Modules/Onward/Enums/onward-returning-applicant.enum';
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import { useCountryStore } from '@/Modules/Common/Stores/Country/country.store';
import LoaderButton from '@/Modules/Common/Components/Form/Buttons/LoaderButton.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';

const returningApplicantTranslation = useCountryStore().returningApplicantTranslation;
const returningApplicantsForm = computed(() => useUserStore().returningApplicantForm);

const errorMessage = ref('');
const loading = ref(false);
const inputs = ref(returningApplicantsForm.value.inputs);

const isFormFilled = computed(() => inputs.value && !inputs.value.find((input) => !input.value));

const note = computed(() => {
  if (!inputs.value) {
    return;
  }
  if (
    inputs.value[0].value === OnwardReturningApplicantEnum.No &&
    inputs.value[1].value === OnwardReturningApplicantEnum.No
  ) {
    return returningApplicantTranslation.footerNo;
  }
  return returningApplicantTranslation.footerYes;
});

const submit = () => {
  loading.value = true;
  if (isFormFilled.value) {
    returningApplicantsForm.value.submit(inputs.value[0].value, inputs.value[1].value) &&
      returningApplicantsForm.value.setDisplayPopup(false);
  }
};
</script>
<style lang="scss" src="./ReturningApplicantQuestions.scss" />
