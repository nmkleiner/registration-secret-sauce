<template>
  <div :class="dropdownClasses" v-on-click-outside="handleCloseList">
    <InputLabel :input="input" />

    <div class="inputWrapper">
      <div class="iconWrapper" @click="toggleList">
        <FontAwesomeIcon :class="iconClasses" icon="fa-light fa-chevron-down" />
      </div>
      <input
        class="field searchable"
        v-if="isSearchable"
        :data-qa-id="input.uniqueName"
        :readonly="input.readonly"
        v-model="displayValue"
        @focus.stop="handleOpenList"
        autocomplete="no"
        :placeholder="props.input.value ? '' : $t('dropdown.select')"
      />
      <div
        class="field placeholder"
        v-else-if="!displayValue"
        :data-qa-id="input.uniqueName"
        v-text="props.input.value ? '' : $t('dropdown.select')"
        @click.stop="toggleList"
      />
      <div :data-qa-id="input.uniqueName" class="field disabled" v-else @click.stop="toggleList">
        <span class="input" v-text="displayValue"></span>
      </div>
    </div>
    <div class="hint" v-text="input.hint" />
    <ErrorMessageComponent :text="message" />
    <template v-if="input.options && input.options.length">
      <Component
        :is="listComponent"
        :input="input"
        :options="filteredOptions"
        v-show="listOpen"
        @select="handleSelectOption"
        @multiSelect="handleMultiSelect"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { Ref } from 'vue';
import { isEmpty } from 'lodash-es';
import { useField } from 'vee-validate';
import { filterList } from '@/Core/Helpers/filter-list';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Option } from '@/Modules/Common/Entities/Options/option';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { useBooleanRef } from '@/Core/Composables/boolean-ref/useBooleanRef';
import InputLabel from '@/Modules/Common/Components/Form/Inputs/Common/InputLabel.vue';
import { InputWithMultiSelect, InputWithOptions } from '@/Modules/Common/Entities/FormElements';
import DropdownList from '@/Modules/Common/Components/Form/Inputs/Dropdown/List/DropdownList.vue';
import { useCommonComponentLogic } from '@/Core/Composables/commonComponentLogic/common-component-logic';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import MultiSelectDropdownList from '@/Modules/Common/Components/Form/Inputs/Dropdown/List/MultiSelectDropdownList.vue';

const props = defineProps<{ input: InputWithOptions }>();
const isMultiSelect = props.input instanceof InputWithMultiSelect;

const listComponent = computed(() => (isMultiSelect ? MultiSelectDropdownList : DropdownList));
const { ref: listOpen, setFalse: closeList, setTrue: openList } = useBooleanRef();

const dropdownClasses = computed(() => [
  'dropdown',
  {
    listOpen: listOpen.value,
    readonly: props.input.readonly,
    onward: useProduct().isOnward.value,
  },
]);
const iconClasses = computed(() => ['icon', { rotate: listOpen.value }]);

const nameRef = toRef(props.input, 'id');
const { errorMessage: message, value } = useField(nameRef, props.input.rules, {
  initialValue: props.input.value,
  label: props.input.label,
});

const displayValue = ref('');
const previousOption = ref<Ref<Option>>(null);

function toggleList() {
  listOpen.value ? handleCloseList() : handleOpenList();
}

function handleSelectOption(selectedOption: Option) {
  props.input.value = selectedOption.value;
  value.value = selectedOption.value;
  setDisplayValue(selectedOption?.label ?? '');
  closeList();
}

defineExpose({
  handleSelectOption,
});

function handleMultiSelect() {
  if (props.input instanceof InputWithMultiSelect) {
    setDisplayValue(Array.from(props.input.selectedOptionValues).join(', '));
    value.value = Array.from(props.input.selectedOptionValues).join(';');
  }
}

function handleCloseList() {
  function checkTypedValue() {
    if (isEmpty(props.input.options)) {
      setDisplayValue('');
      return;
    }

    const option = props.input.options.find((option) => option.label === displayValue.value);
    if (!option) {
      setDisplayValue(previousOption.value?.label ?? '');
    }
  }
  if (!listOpen.value) {
    return;
  }

  closeList();
  if (isMultiSelect) {
    return;
  }
  checkTypedValue();
}

function handleOpenList() {
  if (props.input.readonly) {
    return;
  }

  openList();
  if (isSearchable.value) {
    previousOption.value = props.input.options.find((option) => option.value === props.input.value);
    setDisplayValue('');
  }
}

const isSearchable = computed(() => {
  if (isMultiSelect) {
    return false;
  }
  return props.input.options && props.input.options.length > 10;
});
const filteredOptions = computed(() => {
  if (!isSearchable.value) {
    return props.input.options;
  }

  return filterList(props.input.options, 'label', displayValue.value);
});

function setDisplayValue(str: string) {
  displayValue.value = str || '';
}

function initDisplayValue() {
  if (!props.input.options) {
    return;
  }
  if (props.input instanceof InputWithMultiSelect) {
    setDisplayValue(Array.from(props.input.selectedOptionValues).join(', '));
    return;
  }
  const selectedOption = props.input.options.find((option) => option.value === props.input.value);
  setDisplayValue(selectedOption?.label ?? '');
}

onBeforeMount(initDisplayValue);

const { handleOptionSelected } = useCommonComponentLogic();
watch(value, (newOptionValue) => {
  handleOptionSelected(newOptionValue, props.input);
});
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/onward-field';
@import 'src/assets/style/abstract/hint';

.dropdown {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .inputWrapper {
    position: relative;

    .iconWrapper {
      position: absolute;
      z-index: 1;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 17px;
      cursor: pointer;

      .icon {
        transition: 0.2s;
        font-size: 10px;
        color: $sectionIcon;
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

      .input {
        display: block;
        width: calc(100% - 40px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

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

  &.onward {
    .inputWrapper {
      .field {
        @include onward-field;
      }

      .iconWrapper {
        .icon {
          color: $dark-gray-text;
          font-size: 12px;
        }
      }
    }
    .hint {
      color: $onward-label;
    }

    &.listOpen {
      .inputWrapper {
        .field {
          border: 2px solid $onward-orange;
        }
      }
      .hint {
        visibility: hidden;
      }
    }
  }
}
</style>
