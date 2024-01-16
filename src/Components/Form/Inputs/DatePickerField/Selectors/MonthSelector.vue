<template>
  <Selector
    :items="months"
    data-qa-id="month-selector"
    :disabled="input.yearListOpen"
    :selection-text="selectionText"
    :hide-arrows="input.monthListOpen"
    :lock-next="input.lastMonthInRange"
    :is-list-open="input.monthListOpen"
    :lock-previous="input.firstMonthInRange"
    :selected-item="parseInt(props.input.selectedDate.month)"
    @next="handleNextMonth"
    @previous="handlePreviousMonth"
    @item-selected="handleItemSelected"
    @open-list="() => input.toggleMonthListOpen()"
  />
</template>
<script setup lang="ts">
import { DateInput } from '@/Modules/Common/Entities/FormElements/date-input';
import { useFormatDates } from '@/Core/Composables/dayJs/useFormatDates';
import Selector from '@/Modules/Common/Components/Form/Inputs/DatePickerField/Selectors/Selector.vue';

const { formatDate } = useFormatDates();

const props = defineProps<{ input: DateInput }>();
const months = props.input.months.map((month) => ({
  label: formatDate(month, 'M', 'MMMM'),
  value: month,
}));
const selectionText = computed(() => formatDate(props.input.selectedDate.month, 'M', 'MMM'));

function handleNextMonth() {
  const month = parseInt(props.input.selectedDate.month);
  if (month === 12) {
    props.input.updateSelectedDate({
      month: '1',
      year: String(parseInt(props.input.selectedDate.year) + 1),
    });
  } else {
    props.input.updateSelectedDate({ month: String(month + 1) });
  }
}
function handlePreviousMonth() {
  const month = parseInt(props.input.selectedDate.month);
  if (month === 1) {
    props.input.updateSelectedDate({
      month: '12',
      year: String(parseInt(props.input.selectedDate.year) - 1),
      day: '',
    });
  } else {
    props.input.updateSelectedDate({ month: String(month - 1), day: '' });
  }
}
function handleItemSelected(month: number) {
  props.input.toggleMonthListOpen();
  props.input.updateSelectedDate({ month: String(month), day: '' });
}
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
</style>
