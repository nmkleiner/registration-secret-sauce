<template>
  <div :class="radioButtonClasses">
    <input
      :data-qa-id="group.uniqueName + '-' + option.sort"
      type="radio"
      :name="group.id"
      :id="option.id"
      :value="option.value"
      @change="update"
    />
    <label :class="labelClasses" :for="option.id">
      <span class="radioButton"><span class="innerCircle"></span></span>
      <span class="radioLabel" v-text="option.label"></span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { getEventValue } from '@/Core/Helpers/get-event-value';
import { Option } from '@/Modules/Common/Entities/Options/option';
import { InputWithOptions } from '@/Modules/Common/Entities/FormElements';
import { useProduct } from '@/Core/Composables/program/useProduct';

const props = defineProps<{ option: Option; group: InputWithOptions; selected: boolean }>();
const emit = defineEmits(['update:selectedOption']);

const radioButtonClasses = computed(() => [
  'radioButton',
  {
    readonly: props.group.readonly,
  },
]);
const labelClasses = computed(() => [
  'label',
  {
    checked: props.selected,
    readonly: props.group.readonly,
    pointer: !props.group.readonly && !props.selected,
    onward: useProduct().isOnward.value,
  },
]);

function update(event: Event) {
  if (props.group.readonly) {
    return;
  }

  emit('update:selectedOption', getEventValue(event));
}
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.radioButton {
  margin-right: 24px;

  &:last-child {
    margin-right: 0;

    .radioLabel {
      width: 120px;
    }
  }

  input {
    position: absolute;
    left: -9999px;
  }

  .label {
    display: flex;
    align-items: center;

    .radioButton {
      display: block;
      width: 23px;
      height: 23px;
      background-color: #eef2f4;
      margin-right: 10px;
      border-radius: 50%;
      position: relative;
      transition: 0.3s;
      box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.1);

      .innerCircle {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        position: absolute;
        background-color: transparent;
        top: 6px;
        left: 6px;
        transition: 0.3s;
      }
    }

    .radioLabel {
      font: {
        size: 14px;
        family: Nexa, sans-serif;
      }
      color: #5e656f;
      text-transform: capitalize;
      text-align: left;
      transition: 0.3s;

      @include phone {
        max-width: 100px;
      }
    }

    &.checked {
      .radioButton {
        background-color: #00a0e2;

        .innerCircle {
          background-color: #eef2f4;
        }
      }

      .radioLabel {
        color: $dark-blue;
      }

      &.onward {
        .radioButton {
          background-color: $bright-green-opacity;
        }
      }
    }

    &:hover:not(.checked):not(.readonly) {
      .radioButton {
        background-color: #cdd4d8;
      }

      .radioLabel {
        color: #5e656f;
      }
    }
  }

  &.readonly {
    opacity: $readonly-opacity;
  }
}
</style>
