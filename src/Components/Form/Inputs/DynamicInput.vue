<template>
  <Column :style="columnStyle" :id="input.id">
    <div class="scrollTo" :id="input.id + '-scrollTo'"></div>
    <component ref="componentRef" :is="inputType" :input="input" :formSection="formSection" />
  </Column>
</template>
<script lang="ts" setup>
import { FormSection } from '@/Modules/Common/Entities/Section';
import { useMobileHandler } from '@/Core/Composables/mobileHandler';
import Column from '@/Modules/Common/Components/Wrappers/Column.vue';
import { ComponentTypes } from '@/Modules/Common/Enums/input-types.enum';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import TextArea from '@/Modules/Common/Components/Form/Inputs/TextArea/TextArea.vue';
import Dropdown from '@/Modules/Common/Components/Form/Inputs/Dropdown/Dropdown.vue';
import PassportScan from '@/Modules/Onward/Components/PassportScan/PassportScan.vue';
import PeerQuestion from '@/Modules/Onward/Components/PeerQuestion/PeerQuestion.vue';
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import Paragraph from '@/Modules/Common/Components/Form/Inputs/Paragraph/Paragraph.vue';
import Checkboxes from '@/Modules/Common/Components/Form/Inputs/Checkboxes/Checkboxes.vue';
import Waiver from '@/Modules/Common/Components/Form/Inputs/UniqueInputs/Waiver/Waiver.vue';
import FileInput from '@/Modules/Common/Components/Form/Inputs/FileInput/FileInputComponent.vue';
import RadioButtons from '@/Modules/Common/Components/Form/Inputs/RadioButtons/RadioButtons.vue';
import GoogleAddress from '@/Modules/Common/Components/Form/Inputs/GoogleAddress/GoogleAddress.vue';
import EmergencyQuestion from '@/Modules/Onward/Components/EmergencyQuestion/EmergencyQuestion.vue';
import InternshipSelection from '@/Modules/Excel/Components/InternshipSelection/InternshipSelection.vue';
import DatePickerField from '@/Modules/Common/Components/Form/Inputs/DatePickerField/DatePickerField.vue';
import InternshipSelectionMobile from '@/Modules/Excel/Components/InternshipSelection/InternshipSelectionMobile.vue';
import DropdownWithFlag from '@/Modules/Common/Components/Form/Inputs/Dropdown/DropdownWithFlag/DropdownWithFlag.vue';
import MedicalDiagnosis from '@/Modules/Common/Components/Form/Inputs/MedicalDiagnosis/MedicalDiagnosisComponent.vue';
import RepetitiveButton from '@/Modules/Common/Components/Form/Inputs/RepetitiveQuestion/RepetitiveButtonComponent.vue';
import RepetitiveQuestion from '@/Modules/Common/Components/Form/Inputs/RepetitiveQuestion/RepetitiveQuestionComponent.vue';
import PhoneNumber from '@/Modules/Common/Components/Form/Inputs/PhoneNumber/PhoneNumber.vue';

const props = defineProps<{ input: BasicInput; formSection?: FormSection }>();

const componentRef = ref(null);
defineExpose({
  componentRef,
});

function getInputType(componentType: ComponentTypes) {
  switch (componentType) {
    case ComponentTypes.datePicker:
      return DatePickerField;
    case ComponentTypes.googleAddress:
      return GoogleAddress;
    case ComponentTypes.phoneNumber:
      return PhoneNumber;
    case ComponentTypes.textField:
      return TextField;
    case ComponentTypes.dropdown:
      return Dropdown;
    case ComponentTypes.dropdownWithFlag:
      return DropdownWithFlag;
    case ComponentTypes.fileInput:
      return FileInput;
    case ComponentTypes.checkboxes:
      return Checkboxes;
    case ComponentTypes.textArea:
      return TextArea;
    case ComponentTypes.radioButtons:
      return RadioButtons;
    case ComponentTypes.paragraph:
      return Paragraph;
    case ComponentTypes.internshipSelection:
      return useMobileHandler().isMobile.value ? InternshipSelectionMobile : InternshipSelection;
    case ComponentTypes.waiver:
      return Waiver;
    case ComponentTypes.passportScan:
      return PassportScan;
    case ComponentTypes.peerQuestion:
      return PeerQuestion;
    case ComponentTypes.medicalDiagnosis:
      return MedicalDiagnosis;
    case ComponentTypes.repetitiveQuestion:
      return RepetitiveQuestion;
    case ComponentTypes.repetitiveButton:
      return RepetitiveButton;
    case ComponentTypes.emergencyQuestion:
      return EmergencyQuestion;
  }
}

const inputType = getInputType(props.input.componentType);

const columnStyle = {
  width: calculateWidth(),
};

function calculateWidth() {
  if (useMobileHandler().isMobile.value) {
    return `calc(100% - 20px)`;
  }
  return `calc(${100 * (props.input.columns / props.input.sectionColumns)}% - 20px)`;
}
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.column {
  position: relative;
  margin: 0 10px 25px;
  flex-grow: 1;

  .scrollTo {
    position: absolute;
    top: -150px;
  }
}
</style>
