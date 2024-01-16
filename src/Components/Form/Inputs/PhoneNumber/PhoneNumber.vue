<template>
  <div :class="phoneNumberClasses">
    <TextField :input="input" @focus="showPrefix" />
    <CountryFlag v-if="showCountryFlag" class="flag" :country="input.countryName" />
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/Modules/Common/Stores/User/user.store';
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import { PhoneInput } from '@/Modules/Common/Entities/FormElements/phone-input';
import CountryFlag from 'vue-country-flag-next';
import { useProduct } from '@/Core/Composables/program/useProduct';

const props = defineProps<{ input: PhoneInput }>();

onMounted(() => {
  if (props.input.value) {
    props.input.displayPhonePrefix && showPrefix();
  } else {
    props.input.value = null;
  }
});

const showCountryFlag = computed(() => props.input.countryName && useProduct().isOnward.value);
const phoneNumberClasses = computed(() => [
  'phoneNumber',
  { withoutFlag: !showCountryFlag.value, prefixActive: props.input.displayPhonePrefix },
]);

const showPrefix = () => {
  const phoneNumber = useUserStore().contactInformation.mobilePhone;

  if (phoneNumber && props.input.displayPhonePrefix) {
    props.input.countryPrefix = '+' + phoneNumber.split('-').at(0);
  }
};
</script>
<style lang="scss" scoped>
@import 'src/assets/style/abstract/colors';

.phoneNumber {
  width: 100%;

  &.withoutFlag {
    ::v-deep(.inputWrapper) {
      .prefix {
        left: 16px;
        font-family: NexaRegular, sans-serif;
      }
    }
  }

  .flag {
    position: absolute;
    bottom: calc(50% - 14px);
    left: 16px;
  }

  &.prefixActive {
    ::v-deep(.input) {
      padding-left: 110px;
    }
  }
}
</style>
