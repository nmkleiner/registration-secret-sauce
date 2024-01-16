<template>
  <div class="datePicker" v-on-click-outside="() => input.closeDatePicker()">
    <div class="selectorsContainer">
      <MonthPicker :input="input" />
      <YearPicker :input="input" />
    </div>
    <WeekDays />
    <DayPicker :input="input" />
  </div>
</template>
<script setup lang="ts">
import MonthPicker from '@/Modules/Common/Components/Form/Inputs/DatePickerField/Selectors/MonthSelector.vue';
import YearPicker from '@/Modules/Common/Components/Form/Inputs/DatePickerField/Selectors/YearSelector.vue';
import WeekDays from '@/Modules/Common/Components/Form/Inputs/DatePickerField/WeekDays.vue';
import DayPicker from '@/Modules/Common/Components/Form/Inputs/DatePickerField/DayPicker.vue';
import { DateInput } from '@/Modules/Common/Entities/FormElements/date-input';

const props = defineProps<{ input: DateInput }>();
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.datePicker {
  position: absolute;
  bottom: -8px;
  transform: translateY(100%);
  background-color: $white;
  width: 100%;
  max-width: 320px;
  z-index: 2;
  padding: 8px;
  border-radius: 6px;
  border: solid 1px rgba(1, 47, 93, 0.34);
  cursor: default;

  .selectorsContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    position: relative; // selectors list is relative to this container
  }
}
</style>
