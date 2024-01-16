<template>
  <div :class="datePickerClasses">
    <InputLabel :input="input" />

    <div class="inputWrapper">
      <!--      <div class="iconWrapper">-->
      <!--        <slot name="icons" />-->
      <!--      </div>-->

      <div
        class="field disabled"
        v-text="input.displayValue"
        :data-qa-id="input.uniqueName"
        @click.stop="() => input.openDatePicker()"
      />
      <div v-if="input.hint" class="hint" v-text="input.hint" />
      <ErrorMessageComponent :text="message" />
    </div>
    <KeepAlive>
      <DatePicker v-if="input.datePickerOpen" :input="input" />
    </KeepAlive>
  </div>
</template>
<script setup lang="ts">
import { DateInput } from '@/Modules/Common/Entities/FormElements/date-input';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import InputLabel from '@/Modules/Common/Components/Form/Inputs/Common/InputLabel.vue';
import { useField } from 'vee-validate';
import DatePicker from '@/Modules/Common/Components/Form/Inputs/DatePickerField/DatePicker.vue';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { Ref } from 'vue';

const props = defineProps<{ input: DateInput }>();

const nameRef = toRef(props.input, 'id');
const { errorMessage: message, value } = useField(nameRef, props.input.rules, {
  initialValue: props.input.value,
  label: props.input.label,
});

const datePickerClasses = computed(() => [
  'datePickerField pointer',
  {
    ageError: message.value,
    readonly: props.input.readonly,
    ageWarning: !message.value && hasAgeWarning?.value,
    datePickerOpen: props.input.datePickerOpen,
    onward: useProduct().isOnward.value,
  },
]);

watch(
  () => props.input.value,
  () => {
    value.value = props.input.value;
    updateDateSelected && updateDateSelected(props.input.value);
  },
);

const updateDateSelected = inject('updateDateSelected', (s: string) => null);
const hasAgeWarning = inject('hasAgeWarning', (s: string) => null);
</script>
<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/onward-field';
@import 'src/assets/style/abstract/hint';

.datePickerField {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .inputWrapper {
    position: relative;
    text-align: left;

    .iconWrapper {
      position: absolute;
      z-index: 1;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      cursor: pointer;

      .icon {
        transition: 0.2s;
      }
    }

    .field {
      position: relative;
      width: 100%;
      text-align: left;
      height: 45px;
      padding: 15px 16px 13px;
      border-radius: 6px;
      border: none;
      background-color: $gray;
      color: $dark-blue;
      font-size: 14px;
      font-family: NexaRegular, sans-serif;

      &::placeholder {
        color: $dark-gray;
      }

      &.placeholder {
        color: $dark-gray;
      }
    }
  }

  .hint {
    @include hint;
  }

  &.readonly {
    cursor: default;
    opacity: $readonly-opacity;

    .iconWrapper {
      cursor: default;
    }
  }

  &.datePickerOpen {
    .field {
      border: 2px $bright-azure solid;
    }
  }

  &.ageWarning {
    .field {
      border: 1px $warning solid;
      color: $warning;
    }
  }

  &.ageError {
    .field {
      border: 1px $error solid;
      color: $error;
    }
  }

  &.onward {
    .inputWrapper {
      .field {
        @include onward-field;
      }
      .hint {
        color: $onward-label;
      }
    }

    &.datePickerOpen {
      .field {
        border: 2px $onward-orange solid;
        background-color: $onward-passport-input;
      }
    }

    ::v-deep(.datePicker) {
      .selectorsContainer {
        .list {
          .item {
            padding: 12px 16px 10px;

            &:hover,
            &.selected {
              cursor: pointer;
              background-color: $opacity-onward-orange;
            }
          }
        }
      }

      .weekDays {
        .cell {
          &:hover,
          &.selected {
            &:not(.disabled) {
              background-color: $onward-orange;
              color: $white;
            }
          }
        }
      }

      .dayPicker {
        .cell {
          &:hover,
          &.selected {
            &:not(.disabled) {
              background-color: $onward-orange !important;
              color: $white;
            }
          }
        }
      }
    }
  }
}
</style>
