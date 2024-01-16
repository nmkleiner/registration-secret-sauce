<template>
  <div class="repetitiveQuestion">
    <RadioButtons :input="input" />
    <template v-if="input.displayDependents">
      <Row v-for="row in input.displayedDependents">
        <template v-for="input in row">
          <DynamicInput v-if="input.isVisible" :key="input.id" :input="input" />
        </template>
      </Row>
    </template>
    <RepetitiveButtonComponent
      v-if="input.repetitiveButton.isVisible"
      :input="input.repetitiveButton"
      @add="(index) => input.addDependents(index)"
      @remove="() => input.removeDependents()"
    />
  </div>
</template>
<script setup lang="ts">
import DynamicInput from '@/Modules/Common/Components/Form/Inputs/DynamicInput.vue';
import { RepetitiveQuestion } from '@/Modules/Common/Entities/FormElements/repetitive-question';
import RadioButtons from '@/Modules/Common/Components/Form/Inputs/RadioButtons/RadioButtons.vue';
import RepetitiveButtonComponent from '@/Modules/Common/Components/Form/Inputs/RepetitiveQuestion/RepetitiveButtonComponent.vue';
import Row from '@/Modules/Common/Components/Wrappers/Row.vue';
import { FormSection } from '@/Modules/Common/Entities/Section';

const props = defineProps<{ input: RepetitiveQuestion; formSection: FormSection }>();
</script>
<style scoped lang="scss">
.repetitiveQuestion {
  width: 100%;

  .radioButtons {
    margin-bottom: 20px;
  }
}
</style>
