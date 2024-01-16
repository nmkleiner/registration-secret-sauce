<template>
  <div :class="textFieldClasses">
    <InputLabel :input="input" />
    <div class="inputWrapper">
      <div class="icons">
        <slot name="icons" />
      </div>
      <input
        :data-qa-id="input.uniqueName"
        class="addressInput"
        ref="inputRef"
        :name="input.id"
        :value="value"
        :readonly="input.readonly"
        placeholder="Enter a location"
        @input="onInput"
        @change="onChange"
        @keydown.enter.prevent
      />
      <div
        class="cantFind"
        v-if="!input.readonly"
        v-text="$t('addressModal.cantFind') + ', ' + $t('addressModal.clickHere')"
        @click="openManualAddressModal"
      ></div>
      <dialog class="manualAddressDialog" ref="manualAddressDialog">
        <ManualAddressModal
          v-if="manualAddressDialogOpen"
          :addressInput="input"
          @close="closeManualAddressModal"
          @confirm="handleConfirm"
        />
      </dialog>
    </div>
    <div :class="['messageWrapper', { underGoogleAddress: errorMessage }]">
      <slot name="message"></slot>
      <ErrorMessageComponent :text="errorMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { first } from 'lodash-es';
import { useField } from 'vee-validate';
import { FormSection } from '@/Modules/Common/Entities/Section';
import { Address } from '@/Modules/Common/Interfaces/Form/Inputs/address.interface';
import { AddressInput } from '@/Modules/Common/Entities/FormElements/address-input';
import InputLabel from '@/Modules/Common/Components/Form/Inputs/Common/InputLabel.vue';
import { FullAddress, Place } from '@/Modules/Common/Components/Form/Inputs/GoogleAddress/types';
import ErrorMessageComponent from '@/Modules/Common/Components/Form/Inputs/Common/ErrorMessageComponent.vue';
import ManualAddressModal from '@/Modules/Common/Components/Form/Inputs/GoogleAddress/ManualAddressModal.vue';
import { getProductColor } from '@/Core/Constants/product-style.constants';
import { useProduct } from '@/Core/Composables/program/useProduct';

const ADDRESS_COMPONENTS = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  administrative_area_level_2: 'long_name',
  country: 'short_name',
  postal_code: 'long_name',
};

const props = defineProps<{ input: AddressInput; formSection?: FormSection }>();

const textFieldClasses = computed(() => [
  'textField address',
  { readonly: props.input.readonly, onward: useProduct().isOnward.value },
]);
const { errorMessage, value } = useField(props.input.id as string, props.input.rules, {
  initialValue: props.input.value,
  label: props.input.label,
});

const autocomplete = ref(null);
const isGoogleAddress = ref(true);
const inputRef = ref(null);

onMounted(() => {
  initializeAutocomplete();
  initializeAddress();
});

function initializeAutocomplete() {
  if (props.input.readonly) {
    return;
  }
  autocomplete.value = new google.maps.places.Autocomplete(inputRef.value, {
    types: ['address'],
    fields: ['address_components', 'formatted_address', 'name'],
  });
  autocomplete.value.addListener('place_changed', onPlaceChanged);
}

function initializeAddress(): void {
  if (typeof props.input.value === 'object') {
    injectInput(buildFormattedAddress());
    isGoogleAddress.value = true;
  }
}

function onPlaceChanged(): void {
  const place: Place = autocomplete.value.getPlace();

  if (!place) {
    return;
  }

  isGoogleAddress.value = true;
  injectInput(place.formatted_address);
  props.input.setAddress(convertPlaceToAddress(place));
}

function convertPlaceToAddress(place: Place): Address {
  function convertPlaceToFullAddress(place: Place): FullAddress {
    if (!place || !place.address_components) {
      return;
    }

    const result: FullAddress = {
      administrative_area_level_1: '',
      administrative_area_level_2: '',
      country: '',
      locality: '',
      postal_code: '',
      route: '',
      street_number: '',
    };

    for (const address of place.address_components) {
      const addressType = first(address.types);

      if (ADDRESS_COMPONENTS[addressType]) {
        result[addressType] = address[ADDRESS_COMPONENTS[addressType]];
      }
    }

    return result;
  }

  function convertFullAddressToAddress(fullAddress: FullAddress): Address {
    const streetAddress = fullAddress.street_number
      ? fullAddress.street_number + ' ' + fullAddress.route
      : fullAddress.route;

    return {
      streetAddress,
      city: fullAddress.locality,
      country: fullAddress.country,
      state: fullAddress.administrative_area_level_1,
      zipCode: fullAddress.postal_code,
      isAddress: true,
    };
  }

  const fullAddress = convertPlaceToFullAddress(place);
  return convertFullAddressToAddress(fullAddress);
}

function buildFormattedAddress(): string {
  let addressParts = [];

  //  removed to prevent TS error - delete if no bugs occur
  // addressParts.push(props.input.value.streetAddress);
  // addressParts.push(props.input.value.city);
  // addressParts.push(props.input.value.state);
  // addressParts.push(props.input.value.zipCode);
  // addressParts.push(props.input.value.country);
  addressParts.push(props.input.addressValue.streetAddress);
  addressParts.push(props.input.addressValue.city);
  addressParts.push(props.input.addressValue.state);
  addressParts.push(props.input.addressValue.zipCode);
  addressParts.push(props.input.addressValue.country);

  addressParts = addressParts.filter(Boolean);

  return addressParts.length >= 2 ? addressParts.join(', ') : '';
}

function onInput(event: Event): void {
  isGoogleAddress.value = false;
  value.value = (event.currentTarget as HTMLInputElement).value;
}

function onChange(event: Event): void {
  if (!isGoogleAddress.value) {
    props.input.setAddress(null);
    value.value = '';
    return;
  }

  const eventValue = (event.target as HTMLInputElement).value;
  value.value = eventValue;
  props.input.value = eventValue;
}

function injectInput(input: string): void {
  value.value = input;
  props.input.value = input;
}

const manualAddressDialog = ref(null);
const manualAddressDialogOpen = ref(false);

function openManualAddressModal(): void {
  manualAddressDialog.value.showModal();
  manualAddressDialogOpen.value = true;
}

function closeManualAddressModal(): void {
  manualAddressDialog.value.close();
  manualAddressDialogOpen.value = false;
}

function handleConfirm(address: Address): void {
  props.input.setAddress(address);
  //  removed to prevent TS error - delete if no bugs occur
  // props.input.value = address;
  injectInput(buildFormattedAddress());
  closeManualAddressModal();
}

const productColor = getProductColor();
</script>
<style scoped lang="scss">
@import '../TextField/TextField';

.cantFind {
  position: absolute;
  text-align: left;
  color: v-bind(productColor);
  font-weight: bold;
  margin-top: 4px;
  margin-left: 4px;
  cursor: pointer;
}

.manualAddressDialog {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
