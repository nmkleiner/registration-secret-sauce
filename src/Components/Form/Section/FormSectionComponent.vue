<template>
  <div class="sectionForm">
    <div class="scrollTo" :id="props.formSection.id"></div>
    <Form v-slot="{ validate }">
      <component :is="contentComponent" :formSection="props.formSection" />

      <div class="buttonContainer">
        <Button
          data-qa-id="save"
          primary
          :disabled="isButtonDisabled"
          v-if="props.formSection.saveButtonActive && !props.formSection.isLocked"
          @click.prevent="() => saveSection(validate, true)"
        >
          <FontAwesomeIcon
            v-if="formSection.isSaveAndLock"
            :icon="['far', 'lock-keyhole']"
            class="icon"
          />
          <span v-text="props.formSection.saveButtonText"></span>
        </Button>

        <Button
          data-qa-id="submit"
          primary
          :disabled="isButtonDisabled"
          v-if="isSaveBeforeSubmitActive && !props.formSection.isLocked"
          @click.prevent="() => saveSection(validate)"
        >
          <FontAwesomeIcon
            v-if="formSection.isSaveAndLock"
            :icon="['far', 'lock-keyhole']"
            class="icon"
          />
          <span v-text="'APPLY'"></span>
        </Button>
      </div>
      <div class="commentWrapper" v-if="formSection.isSaveAndLock">
        <FontAwesomeIcon class="icon" icon="fa-light fa-exclamation-circle" />
        <span v-text="$t('form.lockWarning')"></span>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { Form } from 'vee-validate';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { FormSection } from '@/Modules/Common/Entities/Section/form-section';
import SectionGrid from '@/Modules/Common/Components/Form/Section/SectionGrid.vue';
import { default as SubmitGridExcel } from '@/Modules/Excel/Components/Section/SubmitSubComponents/SubmitGrid.vue';
import { default as SubmitGridOnward } from '@/Modules/Onward/Components/Section/SubmitSubComponents/SubmitGrid.vue';
import Phase2SubmitGrid from '@/Modules/Excel/Components/Section/Phase2SubmitSubComponents/Phase2SubmitGrid.vue';
import { isSubmitSection } from '@/Modules/Excel/Entities/Section/Helpers/is-submit-section';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { ExcelSectionNames } from '@/Modules/Excel/Enums/excel-section-names.enum';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { OnwardSectionNames } from '@/Modules/Onward/Enums/onward-section-names.enum';

const props = defineProps<{ formSection: FormSection }>();
function checkToScrollToError(res: { valid: boolean; errors: Record<string, string> }) {
  if (!res.valid) {
    const errorElement = document.getElementById(`${Object.keys(res.errors)[0]}-scrollTo`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

async function saveSection(
  validate: () => Promise<{ valid: boolean; errors: Record<string, string> }>,
  isPhase2SaveProcess: boolean = false,
) {
  const res = await validate();

  if (
    useProduct().isOnward.value &&
    isSubmitSection(props.formSection) &&
    !useApplicationStore().phase1.allowSubmission
  ) {
    await useModalsStore().openModal(ModalNames.submitErrorModal);
    return;
  }

  await props.formSection.save(res.valid, isPhase2SaveProcess);

  if (props.formSection.uniqueName === ExcelSectionNames.waiver && !useProduct().isOnward.value) {
    return;
  }
  checkToScrollToError(res);
}

const activeApplicationPhase = computed(() => useApplicationStore().activePhase);
const isSaveBeforeSubmitActive = computed((): boolean => {
  const isOnwardConsularChecks =
    useProduct().isOnward.value &&
    props.formSection.uniqueName === OnwardSectionNames.consularChecks;

  return isOnwardConsularChecks;
});
const contentComponent = computed(() => {
  if (isSubmitSection(props.formSection)) {
    if (activeApplicationPhase.value === 2) {
      return Phase2SubmitGrid;
    }
    return useProduct().isOnward.value ? SubmitGridOnward : SubmitGridExcel;
  }

  return SectionGrid;
});

const isButtonDisabled = computed((): boolean => {
  if (props.formSection.saveInProcess) {
    return true;
  }
  if (props.formSection.buttonDisabled) {
    return true;
  }

  if (isSubmitSection(props.formSection)) {
    if (useProduct().isOnward.value) {
      return false;
    }
    if (activeApplicationPhase.value === 1) {
      return !useApplicationStore().phase1.allowSubmission;
    }
    if (activeApplicationPhase.value === 2) {
      return !useApplicationStore().phase2.allowSubmission;
    }
  }

  return false;
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.sectionForm {
  position: relative;
  padding: 0 10px;

  .scrollTo {
    position: absolute;
    top: -300px;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;

    .button {
      margin-bottom: 20px;
      margin-right: 20px;

      .icon {
        margin-right: 8px;
      }
    }
  }

  .commentWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    color: $onward-passport-text;

    .icon {
      margin-right: 8px;
      color: $onward-orange;
      font-size: 20px;
    }
  }
}
</style>
