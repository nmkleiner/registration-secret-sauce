<template>
  <p class="paragraph" v-if="hasEmail">
    <span v-text="texts.part1"></span>
    <a :href="'mailto:' + texts.email" v-text="texts.email" class="email"></a>
    <span v-text="texts.part2"></span>
  </p>

  <span class="paragraphWrapper">
    <FontAwesomeIcon
      v-if="hasExclamation"
      class="exclamation"
      icon="fa-light fa-exclamation-circle"
    />
    <span class="paragraph" v-html="processedText" :style="style"></span>
  </span>
</template>
<script lang="ts" setup>
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FormSection } from '@/Modules/Common/Entities/Section';
import { useProduct } from '@/Core/Composables/program/useProduct';
import { TaglitProduct } from '@/Core/Infrastructure/API/taglit-product.enum';
import { getProductColor } from '@/Core/Constants/product-style.constants';

const props = defineProps<{ input: BasicInput; formSection: FormSection }>();

const getEmailMatch = () => {
  const string = props.input.label;
  const emailRegex = /\S+@\S+\.\S+/;

  return emailRegex.exec(string);
};

const hasEmail = computed<boolean>(() => {
  const match = getEmailMatch();

  return Boolean(match);
});

const texts = computed(() => {
  const match = getEmailMatch();

  if (match) {
    const email = match[0];
    const index = match.index;
    const index2 = index + email.length;

    return {
      email,
      part1: props.input.label.slice(0, index),
      part2: props.input.label.slice(index2),
    };
  }
});

const hasExclamation = computed<boolean>(() => {
  // search for {{Exclamation}}
  return props.input.label.search(/\{\{Exclamation\}\}/g) !== -1;
});

const processedText = computed(() => {
  function handleBreakLines(text: string): string {
    return text.replaceAll(/\\\\n/g, '<br/>');
  }

  function handleMedicalFormInjection(text: string): string {
    const medicalDocumentUrl =
      'https://files.taglit-birthrightisrael.com/files/2024%20Birthright%20Israel%20Excel%20Medical%20Form.pdf';
    // Find this {{MedicalForm;text for a tag}} and replace with an a-tag
    return text.replace(
      /\{\{MedicalForm;(.+?)\}\}/g,
      `<a style='color: #00a0e2; text-decoration: none' href="${medicalDocumentUrl}" target="_blank" download='file.pdf'>$1</a>`,
    );
  }

  function handlePrivacyPolicyInjection(text: string): string {
    const privacyPolicyURL = 'https://www.birthrightisrael.com/PrivacyPolicy';
    // Find this {{Privacy Policy}} and replace with an a-tag
    return text.replace(
      /\{\{Privacy Policy\}\}/g,
      `<a style='color: ${getProductColor()}; text-decoration: none' href="${privacyPolicyURL}" target="_blank" >Privacy Policy</a>`,
    );
  }

  function handleExclamation(text: string): string {
    return text.replaceAll(/\{\{Exclamation\}\}/g, '');
  }

  return handleExclamation(
    handlePrivacyPolicyInjection(handleMedicalFormInjection(handleBreakLines(props.input.label))),
  );
});

const style = ref();
function getStyleMetadata() {
  const metaData = props.input.label.match(/(%)(\w+):(.+)(%)/);
  if (metaData) {
    style.value = getKeyValueFromStyleMetadata(metaData);
    props.input.label = removeStyleMetadata(props.input.label);
  }
}

function getKeyValueFromStyleMetadata(styleMetadata) {
  const paragraphStyle = {};
  const [, , metadataKey, metadataValue] = styleMetadata;
  paragraphStyle[metadataKey] = metadataValue;
  return paragraphStyle;
}

function removeStyleMetadata(label: string): string {
  return label.replace(/(%)(\w+):(.+)(%)/, '');
}

onMounted(() => {
  getStyleMetadata();
});

const color = (() => {
  switch (useProduct().product.value) {
    case TaglitProduct.EXCEL:
      return '#012f5d';
    case TaglitProduct.ONWARD:
      return '#515e59';
  }
})();
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.paragraphWrapper {
  text-align: left;
  line-height: 1.5;
  color: v-bind(color);

  .paragraph {
    line-height: 1.5;
    text-align: left;
    color: v-bind(color);

    .email {
      color: $azure;
    }
  }

  .exclamation {
    margin-right: 16px;
  }
}
</style>
