<template>
  <div class="errorModalWrapper">
    <div class="generalErrorMessage">
      <FontAwesomeIcon class="check" icon="fa-solid fa-circle-check" />
      <span class="title" v-html="title"></span>
      <p class="description" v-html="description"></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getProductColor } from '@/Core/Constants/product-style.constants';
import { useUserAgeValidation } from '@/Modules/Common/Composables/use-birth-date-validation';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { isBetweenAgeActive } = useUserAgeValidation();

const productColor = getProductColor();

const title = computed(() => {
  return isBetweenAgeActive.value
    ? t('excelLoginPage.betweenAges.title')
    : t('excelLoginPage.underMinAge.title');
});

const description = computed(() => {
  return isBetweenAgeActive.value
    ? t('excelLoginPage.betweenAges.description')
    : t('excelLoginPage.underMinAge.description');
});
</script>

<style lang="scss" scoped>
@import 'src/assets/style/abstract/breakpoints';
@import 'src/assets/style/abstract/colors';

.errorModalWrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding: 40px;
  width: 380px;
  text-align: left;
  font-family: Nexa, sans-serif;
  color: $dark;

  @include tablet {
    width: unset;
  }

  .iconWrapper {
    padding: 10px;
  }

  .generalErrorMessage {
    .check {
      color: v-bind(productColor);
      font-size: 45px;
      margin-bottom: 20px;
    }

    .title {
      font-size: 18px;
      display: block;
      margin-bottom: 20px;
    }

    .description {
      line-height: 1.75;
    }
  }
}
</style>
