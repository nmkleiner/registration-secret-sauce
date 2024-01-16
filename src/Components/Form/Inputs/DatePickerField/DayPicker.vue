<template>
  <div class="dayPicker">
    <div class="cell disabled" v-for="day in previousMonthDays" v-text="day"></div>
    <div
      class="cell pointer"
      v-for="day in currentMonthDays"
      :class="{ selected: day === selectedDay }"
      :data-qa-id="day"
      v-text="day"
      @click="() => handleDaySelected(day)"
    ></div>
    <div class="cell disabled" v-for="day in nextMonthDays" v-text="day"></div>
  </div>
</template>
<script setup lang="ts">
import { DateInput } from '@/Modules/Common/Entities/FormElements/date-input';

const props = defineProps<{ input: DateInput }>();

function handleDaySelected(day: number) {
  props.input.updateSelectedDate({ day: String(day) });
  props.input.closeDatePicker();
}
const selectedDay = computed(() => parseInt(props.input.selectedDate.day));
const currentYear = computed(() => parseInt(props.input.selectedDate.year));

const previousMonth = computed(() => {
  const month = parseInt(currentMonth.value);
  if (month === 1) {
    return 12;
  }
  return month - 1;
});
const previousMonthDays = computed(() => {
  const month = previousMonth.value;
  const year = currentYear.value;
  const daysInMonth = new Date(year, month, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return days.splice(days.length - firstDay);
});

const currentMonth = computed(() => parseInt(props.input.selectedDate.month));
const currentMonthDays = computed(() => {
  const month = currentMonth.value;
  const year = currentYear.value;
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
});

const nextMonthDays = computed(() => {
  const totalDays = 6 * 7;
  const previousAndCurrentDays = previousMonthDays.value.length + currentMonthDays.value.length;
  const daysLeft = totalDays - previousAndCurrentDays;

  return Array.from({ length: daysLeft }, (_, i) => i + 1);
});
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'cell';

.dayPicker {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
