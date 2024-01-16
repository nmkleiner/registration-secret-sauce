<template>
  <div class="dropdownWithFlag">
    <Dropdown :input="input" />
    <CountryFlag v-if="input.value" class="flag" :country="input.value" />
  </div>
</template>
<script lang="ts" setup>
import CountryFlag from 'vue-country-flag-next';
import Dropdown from '@/Modules/Common/Components/Form/Inputs/Dropdown/Dropdown.vue';
import { CountryDropdown } from '@/Modules/Common/Entities/FormElements/country-dropdown';

defineProps<{ input: CountryDropdown }>();
</script>

<style scoped lang="scss">
@import '/src/assets/style/abstract/colors';

.dropdownWithFlag {
  width: 100%;
  position: relative;

  ::v-deep(.dropdown) {
    .field {
      padding-left: calc(32px + 16px + 8px);
      &::placeholder {
        transform: translateX(-40px);
      }
    }
  }

  .flag {
    position: absolute;
    bottom: calc(50% - 14px);
    left: 16px;
  }
}
</style>
