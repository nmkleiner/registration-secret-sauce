<template>
  <Selector
    :items="years"
    data-qa-id="year-selector"
    :selection-text="selectionText"
    :hide-arrows="input.yearListOpen"
    :disabled="input.monthListOpen"
    :should-scroll-to-bottom="true"
    :lock-next="input.lastYearInRange"
    :is-list-open="input.yearListOpen"
    :lock-previous="input.firstYearInRange"
    :selected-item="parseInt(props.input.selectedDate.year)"
    @next="handleNextYear"
    @previous="handlePreviousYear"
    @item-selected="handleItemSelected"
    @open-list="() => input.toggleYearListOpen()"
  />
</template>
<script setup lang="ts">
import { DateInput } from '@/Modules/Common/Entities/FormElements/date-input';
import Selector from '@/Modules/Common/Components/Form/Inputs/DatePickerField/Selectors/Selector.vue';

const props = defineProps<{ input: DateInput }>();
const years = props.input.years.map((year) => ({
  label: String(year),
  value: year,
}));
const selectionText = computed(() => props.input.selectedDate.year);

function handleNextYear() {
  const year = parseInt(props.input.selectedDate.year);
  props.input.updateSelectedDate({ year: String(year + 1), day: '' });
}
function handlePreviousYear() {
  const year = parseInt(props.input.selectedDate.year);
  props.input.updateSelectedDate({ year: String(year - 1), day: '' });
}
function handleItemSelected(year: number) {
  props.input.toggleYearListOpen();
  props.input.updateSelectedDate({ year: String(year), day: '' });
}
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
</style>
