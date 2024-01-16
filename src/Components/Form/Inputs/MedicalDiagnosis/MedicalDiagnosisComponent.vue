<template>
  <div class="medicalDiagnosis">
    <Checkboxes :input="input" />
  </div>
</template>
<script setup lang="ts">
import { MedicalDiagnosis } from '@/Modules/Common/Entities/FormElements/medical-diagnosis';
import Checkboxes from '@/Modules/Common/Components/Form/Inputs/Checkboxes/Checkboxes.vue';

const props = defineProps<{ input: MedicalDiagnosis }>();

onBeforeMount(() => {
  props.input.initializeSelectedOptions();
});
</script>

<style scoped lang="scss">
.medicalDiagnosis {
  width: 100%;
}
</style>
