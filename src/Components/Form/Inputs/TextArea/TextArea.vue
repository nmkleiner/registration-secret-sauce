<template>
  <div :class="textAreaClasses">
    <TextField :input="input" type="textarea">
      <template #message>
        <span class="wordsCounter" v-text="wordCounterMessage"></span>
      </template>
    </TextField>
  </div>
</template>
<script lang="ts" setup>
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { wordCount } from '@/Core/Validation/CustomRules/words-rules';
import { useI18n } from 'vue-i18n';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { getProductColor } from '@/Core/Constants/product-style.constants';

const props = defineProps<{ input: BasicInput }>();
const { t } = useI18n();

const textAreaClasses = computed(() => [
  'textArea',
  {
    onward: useProduct().isOnward.value,
  },
]);

const wordCounterMessage = computed(() => {
  const count = wordCount(props.input.value);
  const message = t('inputs.textArea.wordCount', { wordCount: count });

  const minWords = props.input.rules.minWords?.[0];
  const maxWords = props.input.rules.maxWords?.[0];

  if (minWords && maxWords) {
    return message.concat(
      ' ' + t('inputs.textArea.range', { minWords: minWords, maxWords: maxWords }),
    );
  }
  if (minWords) {
    return message.concat(' ' + t('inputs.textArea.minimum', { minWords: minWords }));
  }
  if (maxWords) {
    return message.concat(' ' + t('inputs.textArea.maximum', { maxWords: maxWords }));
  }

  return message;
});

const labelCharCount = props.input.label.length;
const marginBottom = `${labelCharCount * 0.6}px`;
const productColor = getProductColor();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';
@import 'src/assets/style/abstract/breakpoints';

.textArea {
  width: 100%;
  height: 91px;
  margin-bottom: 16px;

  @include phone {
    margin-bottom: v-bind(marginBottom);
  }

  ::v-deep(.textField) {
    input {
      padding-top: 0;
      padding-bottom: 0;

      &::placeholder {
        display: none;
      }
    }
  }

  .wordsCounter {
    display: block;
    margin-top: 2px;
    text-align: left;
    font-size: 10px;
  }

  &.onward {
    .wordsCounter {
      display: block;
      font-size: 12px;
      color: $onward-label;
    }
  }
}
</style>
