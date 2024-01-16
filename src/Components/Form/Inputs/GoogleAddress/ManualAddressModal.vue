<template>
  <div class="manualAddressModal">
    <div class="header" v-text="$t('addressModal.header')"></div>
    <Form class="form" @submit="confirm">
      <DynamicInput
        v-for="input in visibleInputs"
        :ref="(el) => (inputRefs[input.id] = el)"
        :key="input.id"
        :input="input"
      />

      <div class="footer">
        <Button
          data-qa-id="close"
          secondary
          :text="$t('editProfile.close')"
          @click.prevent="emit('close')"
        />
        <Button data-qa-id="confirm" primary :text="$t('addressModal.confirmation')" />
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
import { Form } from 'vee-validate';
import { FormBuilderApi } from '@/Modules/Common/API';
import Button from '@/Modules/Common/Components/Form/Buttons/Button.vue';
import { BasicInput } from '@/Modules/Common/Entities/FormElements';
import DynamicInput from '@/Modules/Common/Components/Form/Inputs/DynamicInput.vue';
import { AddressInput } from '@/Modules/Common/Entities/FormElements/address-input';
import { StateDropdown } from '@/Modules/Common/Entities/FormElements/state-dropdown';
import { Address } from '@/Modules/Common/Interfaces/Form/Inputs/address.interface';
import { manualAddressInputsCreator } from '@/Modules/Common/Creators/ManualAddressModal/local-state-manual-address.creator';
import { AddressFields } from '@/Modules/Common/Enums/address-fields.enum';

const props = defineProps<{ addressInput: AddressInput }>();
const emit = defineEmits(['close', 'confirm']);
const inputRefs = reactive<Record<AddressFields, BasicInput>>({
  country: null,
  state: null,
  city: null,
  street: null,
  zipCode: null,
});
const inputs = ref(manualAddressInputsCreator(props.addressInput));
const visibleInputs = computed(() =>
  Array.from(Object.values(inputs.value)).filter((input: BasicInput) => input.isVisible),
);

const updateStateDropdown = (countryInput: BasicInput) => {
  (inputs.value.state as StateDropdown).filterOptionsByCountry(countryInput.value);
};
watch(inputs.value.country, updateStateDropdown, { immediate: true });

async function getAddressByZipCode(zipCodeInput: BasicInput) {
  const zipCode = zipCodeInput.value;
  const countryIsoCode = inputs.value.country.value;

  if (countryIsoCode === 'US' && zipCode?.length === 5) {
    const response = await FormBuilderApi.getAddressByZipCode(zipCode, 'USA');

    if (response) {
      inputs.value.city.value = response.city;
      const selectedStateOption = (inputs.value.state as StateDropdown).options.find(
        (option) => option.value === response.stateCode,
      );

      if (selectedStateOption) {
        inputRefs.state?.componentRef?.handleSelectOption(selectedStateOption);
      }
    }
  }
}

watch(inputs.value.zipCode, getAddressByZipCode);

function confirm(address: Address) {
  emit('confirm', address);
}
</script>

<style scoped lang="scss">
@import '/src/assets/style/abstract/breakpoints';

.manualAddressModal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1020px;
  max-width: 100%;
  padding: 0 20px;

  .header {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 20px 12px;
    //padding: 16px 0;
  }

  .form {
    width: 100%;

    .footer {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 16px 0;

      .secondary {
        margin-right: 16px;
      }
    }
  }
}
</style>
