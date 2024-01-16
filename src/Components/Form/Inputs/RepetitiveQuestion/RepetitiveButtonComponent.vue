<template>
  <div class="repetitiveButtons">
    <div class="button" v-if="displayAddButton" v-text="input.label" @click="handleAdd"></div>
    <div class="button" v-if="displayRemoveButton" v-text="input.hint" @click="handleRemove"></div>
  </div>
</template>
<script setup lang="ts">
import { RepetitiveButton } from '@/Modules/Common/Entities/FormElements/repetitive-button';

const props = defineProps<{ input: RepetitiveButton }>();
const emit = defineEmits<{ add: (index: number) => void; remove: () => void }>();

function handleAdd() {
  props.input.incrementIndex();
  emit('add', props.input.index);
}

function handleRemove() {
  props.input.decrementIndex();
  emit('remove');
}

const displayAddButton = computed(() => props.input.index !== props.input.maximumIndex);
const displayRemoveButton = computed(() => props.input.index !== props.input.minimumIndex);
</script>

<style scoped lang="scss">
@import '@/assets/style/abstract/colors';

.repetitiveButtons {
  display: flex;

  .button {
    font-weight: bold;
    color: $onward-orange;
    cursor: pointer;
    user-select: none;

    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
