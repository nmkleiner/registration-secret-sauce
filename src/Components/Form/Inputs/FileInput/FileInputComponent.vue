<template>
  <div :class="fileInputGroupClasses">
    <input
      class="fileInput"
      type="file"
      ref="file"
      :id="fileInputId"
      @input="onFileSelected"
      :accept="allowedFileTypes"
      :disabled="input.readonly"
    />
    <label :for="fileInputId">
      <TextField class="field" :input="input" :readonly="true" displayHint>
        <template #icons>
          <div :class="uploadClasses">
            <FontAwesomeIcon icon="fa-light fa-upload" :class="input.file && 'mr'" />
            <template v-if="input.file">
              <FontAwesomeIcon icon="fa-light fa-xmark" @click.prevent="cancel" />
            </template>
          </div>
        </template>
      </TextField>
    </label>
  </div>
</template>
<script lang="ts" setup>
import TextField from '@/Modules/Common/Components/Form/Inputs/TextField/TextField.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FileInput } from '@/Modules/Common/Entities/FormElements/file-input';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { useModalsStore } from '@/Modules/Common/Stores/Modals/modals.store';
import { ModalNames } from '@/Modules/Common/Stores/Modals/modals-state.interface';
import { useProfilePictureFileInput } from '@/Modules/Common/Components/Form/Inputs/FileInput/Composables/useProfilePictureFileInput';
import { translate } from '@/Core/Translations/vue-i18n';
import { useProduct } from '@/Core/Composables/program/useProduct';

const props = defineProps<{ input: FileInput }>();
const uploadClasses = computed(() => ({
  mr2: props.input.file,
}));

const fileInputGroupClasses = computed(() => [
  'fileInputGroup',
  {
    readonly: props.input.readonly,
  },
]);

const maxFileSize = computed(() => useApplicationStore().maxFileSize);

const { ProfilePicture, checkToUploadProfilePicture, saveProfilePictureFromDocumentUploads } =
  useProfilePictureFileInput();

function onFileSelected(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) {
    // no file
    return;
  }

  const file = files.item(0);
  if (!file) {
    // no file
    return;
  }

  const fileSizeInMB = convertFileSizeToMB(file.size);
  if (fileSizeInMB > maxFileSize.value) {
    // file too big
    useModalsStore().openModal(ModalNames.maxFileSizeError);
    return;
  }

  if (!props.input.isValidFileType(file)) {
    props.input.setErrors([translate('error.invalidFileType') as string]);
    return;
  }

  props.input.file = file;
  props.input.value = file.name;

  if (useProduct().isExcel.value && props.input.fileTopic === ProfilePicture) {
    useModalsStore().openModal(ModalNames.profilePicture);
  }
}

function cancel() {
  props.input.file = null;
  props.input.value = '';
}

function convertFileSizeToMB(size: number): number {
  return size / 1024 / 1024;
}

const allowedFileTypes = computed(() => props.input.allowedFileTypes?.join(','));
const fileInputId = computed(() => props.input.id + 'label');

watch(saveProfilePictureFromDocumentUploads, (newValue) =>
  checkToUploadProfilePicture(newValue, props.input),
);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/colors';

.fileInputGroup {
  width: 100%;
  position: relative;

  ::v-deep(.textField) {
    input {
      padding-right: 88px;
    }
  }

  ::v-deep(.icons) {
    cursor: pointer;
    padding: 12px;

    svg {
      color: $dark-gray-text;
    }

    .mr {
      margin-right: 12px;
    }
  }

  &.readonly {
    opacity: $readonly-opacity;

    ::v-deep(.icons) {
      cursor: default;
    }
  }

  .fileInput {
    visibility: hidden;
    position: absolute;
    right: 0;
    width: 30px;
    top: 25%;
  }
}
</style>
