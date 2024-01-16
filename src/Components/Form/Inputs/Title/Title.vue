<template>
  <div
    :class="classNameAndProduct(['title', { small, requiredInputLabel: required }])"
    v-html="processedTitle"
  ></div>
</template>
<script lang="ts" setup>
import { useGenerateNameStyle } from '@/Modules/Common/Composables/use-generate-name-style';

const props = withDefaults(defineProps<{ title: string; small?: boolean; required?: boolean }>(), {
  small: false,
  required: false,
});

const { classNameAndProduct } = useGenerateNameStyle();

const processedTitle = computed(() => props.title.replaceAll(/\\\\n/g, '<br/>'));
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.title {
  font-size: 20px;
  color: $dark-blue;
  line-height: 1.5;
  text-align: left;

  &.small {
    font-size: 16px;
  }

  &.onward {
    font-size: 16px;
    color: $dark-gray-text;
  }
}
</style>
